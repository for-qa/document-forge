# Document Forge

**Document Forge** is a modern, open-source Web Application and REST API powered by Node.js, Express, and [Playwright](https://playwright.dev/). It seamlessly converts local HTML files or live remote URLs into high-quality A4 PDFs or high-fidelity PNG images without requiring any command-line tools.

## 🌟 Key Features

* 🌐 **Modern Web UI**: A beautiful, responsive web interface allowing anyone to easily upload HTML files or paste live URLs to generate documents instantly.
* 🔌 **Express REST API**: A fully functional API endpoint (`/api/generate`) securely handling multipart form-data (file uploads) and JSON payloads for programmatic access.
* 🌙 **Dark Mode Emulation**: Built-in toggle to force the headless browser to capture webpages utilizing their respective dark themes.
* 📏 **Custom Viewports**: Export custom high-fidelity PNGs at an exact viewport dimension (e.g., 1920x1080 or custom presets).
* ⚡ **Playwright Engine**: Utilizes the robust Playwright browser automation framework behind the scenes for pixel-perfect Chromium rendering and native wait-for-fonts loading.

## 🚀 Getting Started

If you have just cloned the repository, be sure to install all the required Node.js dependencies:

```bash
npm install
```

### Starting the Web Server

Document Forge runs as a local Express server:

```bash
npm start
```
By default, the application will spin up at **`http://localhost:3000`**.

### Using the Web UI
Simply open your browser and navigate to `http://localhost:3000`. 

1. **Data Source:** Toggle between entering a live website URL or securely browsing for a local `.html` file on your computer.
2. **Output Format:** Choose whether you want a crisp A4 PDF or a custom Image snapshot (PNG).
3. **Advanced Settings:** Enable Dark Mode capturing or precisely manually adjust viewport bounds before rendering your capture!

### Using the REST API
If you're integrating Document Forge into another service or backend system, you can easily interface with the programmatic REST architecture.

**Endpoint:** `POST /api/generate`  
_Accepts `multipart/form-data` with the following variables:_
- `url` (String): The target website HTTP link (optional if uploading a file).
- `htmlFile` (File): Local `.html` file upload (optional if passing url).
- `type` (String): `pdf` or `image` (Selects the generation format).
- `darkMode` (String): `"true"` (Forces the CSS dark theme engine).
- `width` / `height` (Numeric String): Controls the screenshot viewport framing size.

---

## Support & Recognition

If you find this project helpful and want to support its continued development, the best way is through **recognition**:

1. **Attribution:** Please keep the original copyright notices intact in the code. If you use this tool or its code in a public project, a shoutout or a link back to this repository is highly appreciated!
2. **Contribute Code:** We welcome pull requests! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to help build this tool.
3. **Star the Repo:** Giving the project a ⭐️ on GitHub helps others find it and gives the author recognition.

## License

This project is licensed under the [MIT License](LICENSE). 

Under the MIT License, anyone who uses, copies, or modifies this code must include your original copyright notice, ensuring you always receive credit for your work.

---

_For professional inquiries, connect on [LinkedIn](https://www.linkedin.com/in/gairik-singha/)._
