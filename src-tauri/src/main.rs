// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Proxy;
use serde::{Deserialize, Serialize};
use tauri::command;
use std::time::Instant;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
struct ProxyData {
    address: String,
    port: u16,
    username: String,
    password: String,
    response_time: f64,
    status: String,
}

#[command]
async fn test_proxies(proxies: Vec<String>, test_url: String) -> Result<Vec<ProxyData>, String> {

    let mut results = Vec::new();

    for (_index, proxy_str) in proxies.iter().enumerate() {

        let parts: Vec<&str> = proxy_str.split(':').collect();
        if parts.len() != 4 {
            println!("Invalid proxy format: {}", proxy_str);
            return Err(format!("Invalid proxy format: {}", proxy_str));
        }

        let address = parts[0].to_string();
        let port: u16 = parts[1].parse().map_err(|e: std::num::ParseIntError| {
            println!("Error parsing port: {}", e);
            e.to_string()
        })?;
        let username = parts[2].to_string();
        let password = parts[3].to_string();

        let proxy_url = format!("http://{}:{}@{}:{}", username, password, address, port);

        let proxy = match Proxy::all(&proxy_url) {
            Ok(p) => p,
            Err(e) => {
                println!("Error creating proxy: {}", e);
                return Err(e.to_string());
            }
        };

        let client = match reqwest::Client::builder()
            .proxy(proxy)
            .timeout(std::time::Duration::from_secs(10))
            .build()
        {
            Ok(c) => c,
            Err(e) => {
                println!("Error building client: {}", e);
                return Err(e.to_string());
            }
        };

        let start = Instant::now();
        let response = client.get(&test_url).send().await;
        let duration = start.elapsed();

        let (status, response_time) = match response {
            Ok(_) => {
                ("Working".to_string(), duration.as_secs_f64() * 1000.0)
            },
            Err(e) => {
                println!("Proxy not working: {}. Error: {}", proxy_str, e);
                ("Not Working".to_string(), 0.0)
            }
        };

        results.push(ProxyData {
            address,
            port,
            username,
            password,
            response_time,
            status,
        });
    }

    Ok(results)
}

#[tauri::command]
async fn save_working_proxies(proxies: Vec<ProxyData>) -> Result<(), String> {
    let working_proxies: Vec<String> = proxies
        .into_iter()
        .filter(|proxy| proxy.status == "Working")
        .map(|proxy| format!("{}:{}:{}:{}", proxy.address, proxy.port, proxy.username, proxy.password))
        .collect();

    let content = working_proxies.join("\n");

    let file_path: Option<PathBuf> = tauri::api::dialog::blocking::FileDialogBuilder::new()
        .add_filter("Text Files", &["txt"])
        .save_file();

    if let Some(path) = file_path {
        fs::write(path, content).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("File save cancelled".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![test_proxies, save_working_proxies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}