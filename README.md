# Document Forge

**Document Forge** is a robust Command-Line Interface (CLI) tool that uses [Playwright](https://playwright.dev/) and a headless Chromium browser to render local HTML files or remote URLs and easily capture high-quality A4 PDFs or images.

## Project Structure

* **`assets/`**: Place all of your local input files here (e.g., HTML, CSS, images, fonts). This is where the tool will look for local filenames by default.
* **`output/`**: Any generated files (.pdf, .png) will be automatically created and exported into this folder.
* **`index.js`**: The single, unified entry-point command line script for the tool.

## Prerequisites

If you have just cloned the repository, be sure to install all the required Node.js dependencies:

```bash
npm install
```

---

## 🚀 How To Use Document Forge

With the newly updated robust CLI interface, you can generate PDFs or images, pass directly live website URLs, and apply dark mode using terminal flags!

### The `pdf` Command: Generating PDF documents
Generate crisp, borderless, A4 PDF files. You can pass in a local filename (from your `assets/` folder) OR a live http/https URL.

**Usage:**
```bash
node index.js pdf <input> [output_filename] [options]
```

**Examples:**
```bash
# Renders 'assets/resume.html' and exports to 'output/resume.pdf'
node index.js pdf resume.html

# Renders a remote URL and saves it custom named to 'output/my_github.pdf'
node index.js pdf https://github.com/for-qa my_github.pdf

# Renders the HTML file with Dark Mode enabled 🌙
node index.js pdf resume.html --dark
```

### The `image` Command: Capturing Screenshots
Captures high-resolution PNG snapshots of a document or webpage. By default, it captures a 2800x700 viewport, but this can be customized perfectly for your needs!

**Usage:**
```bash
node index.js image <input> [output_filename] [options]
```

**Options:**
- `-d, --dark`: Emulate dark mode CSS scheme. 🌙
- `-w, --width <pixels>`: The viewport width (Default: 2800)
- `-h, --height <pixels>`: The viewport height (Default: 700)

**Examples:**
```bash
# Capture a simple image from a local html file
node index.js image banner.html

# Capture an image from a live website with a custom 1920x1080 viewport size! 
node index.js image https://google.com my_google_snap.png --width 1920 --height 1080

# Capture a local file enforcing dark mode CSS themes
node index.js image banner.html --dark
```

---

### Tips
* Using `<link rel="stylesheet" href="./style.css">` inside your HTML will natively resolve perfectly if it is inside the `assets/` folder.
* The Playwright engine has built-in waits specifically looking for `document.fonts.ready` to ensure your web fonts and icon-fonts load perfectly every time!
* All progress updates will cleanly spin via `ora` in your terminal to easily let you know when the resource tracking is done!
