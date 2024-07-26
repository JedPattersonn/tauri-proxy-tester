"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { invoke } from "@tauri-apps/api/tauri";
import { Toaster, toast } from "react-hot-toast";

interface ProxyData {
  address: string;
  port: number;
  username: string;
  password: string;
  response_time: number;
  status: "Working" | "Not Working";
}

export default function ProxyTester() {
  const [proxies, setProxies] = useState<string>("");
  const [testUrl, setTestUrl] = useState<string>("https://www.google.com");
  const [proxyList, setProxyList] = useState<ProxyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleTestProxies = async () => {
    if (!proxies.trim()) {
      toast.error("Please enter at least one proxy to test.");
      return;
    }

    if (!testUrl.trim()) {
      toast.error("Please enter a valid URL to test against.");
      return;
    }

    const proxyArray = proxies.trim().split("\n");
    setIsLoading(true);
    const toastId = toast.loading("Testing proxies...");

    try {
      const proxyData = await invoke<ProxyData[]>("test_proxies", {
        proxies: proxyArray,
        testUrl,
      });
      setProxyList(proxyData);
      toast.success(`Tested ${proxyData.length} proxies successfully.`, {
        id: toastId,
      });
    } catch (error) {
      console.error("Error testing proxies:", error);
      toast.error(`Failed to test proxies: ${error}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportWorkingProxies = async () => {
    const workingProxies = proxyList.filter(
      (proxy) => proxy.status === "Working"
    );
    if (workingProxies.length === 0) {
      toast.error("No working proxies to export.");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Exporting working proxies...");

    try {
      await invoke<void>("save_working_proxies", { proxies: proxyList });
      toast.success("Working proxies exported successfully", { id: toastId });
    } catch (error) {
      console.error("Error exporting working proxies:", error);
      toast.error(`Failed to export working proxies: ${error}`, {
        id: toastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          Proxy Tester
        </h1>
        <div className="mb-6">
          <Textarea
            placeholder="Enter proxies (one per line, format: address:port:username:password)"
            value={proxies}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setProxies(e.target.value)
            }
            className="w-full h-40 p-4 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6 flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Enter website to test"
            value={testUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTestUrl(e.target.value)
            }
            className="flex-grow p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleTestProxies}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Testing..." : "Test Proxies"}
          </Button>
        </div>
        {proxyList.length > 0 && (
          <div className="mb-6">
            <Button
              onClick={handleExportWorkingProxies}
              disabled={
                isExporting ||
                proxyList.every((proxy) => proxy.status === "Not Working")
              }
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? "Exporting..." : "Export Working Proxies"}
            </Button>
          </div>
        )}
        {proxyList.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow className="bg-indigo-100">
                  <TableHead className="font-semibold text-indigo-700">
                    Proxy Address
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Port
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Username
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Password
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Response Time (ms)
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proxyList.map((proxy, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-indigo-50" : "bg-white"}
                  >
                    <TableCell>{proxy.address}</TableCell>
                    <TableCell>{proxy.port}</TableCell>
                    <TableCell>{proxy.username}</TableCell>
                    <TableCell>{proxy.password}</TableCell>
                    <TableCell>{proxy.response_time.toFixed(2)}</TableCell>
                    <TableCell>
                      <div
                        className={`px-2 py-1 rounded-full text-center ${
                          proxy.status === "Working"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {proxy.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
