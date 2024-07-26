# Devly Proxy Tester

![Proxy Tester Logo](https://imgur.com/qvNW669.gif)

Proxy Tester is a powerful, cross-platform desktop application built with Rust, Next.js, and Tauri. It allows users to easily test and manage proxy servers, providing a seamless experience for developers and network administrators.

## Features

- 🚀 **Fast Proxy Testing**: Quickly test multiple proxies against a specified URL
- 📊 **Clear Results Display**: View test results in an easy-to-read table format
- 💾 **Export Functionality**: Save working proxies to a file for future use
- 🖥️ **Cross-Platform**: Works on Windows, macOS, and Linux
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS for a sleek user experience

## Installation

To get started with Proxy Tester, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/jedpattersonn/tauri-proxy-tester.git
   cd tarui-proxy-tester
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Build the application:

   ```
   pnpm tauri build
   ```

4. The built application will be available in the `src-tauri/target/release` folder.

## Usage

1. Launch the Proxy Tester application.
2. Enter your proxies in the text area, one per line, in the format: `address:port:username:password`
3. (Optional) Modify the test URL if needed.
4. Click "Test Proxies" to start the testing process.
5. View the results in the table below.
6. Use the "Export Working Proxies" button to save functional proxies to a file.

## Development

To run the application in development mode:

```
pnpm tauri dev
```

This will start the Next.js development server and launch the Tauri application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/)
- [Next.js](https://nextjs.org/)
- [Rust](https://www.rust-lang.org/)
- [shadcn/ui](https://ui.shadcn.com/)

## Contact

If you have any questions, feel free to reach out to [hi@jedpatterson.com](mailto:hi@jedpatterson.com).

---

Made with ❤️ by [Jed Patterson](https://jedpatterson.com)
