# Document Forge

This tool uses [Playwright](https://playwright.dev/) to render local HTML files via a headless Chromium browser, allowing you to easily generate high-quality PDF files and capture screenshots (images) from your HTML projects.

## Project Structure

* **`assets/`**: Place all of your local input files here (e.g., HTML, CSS, images, fonts). This is where the scripts will look for the source files by default.
* **`output/`**: Any generated `.pdf` or `.png` files will be automatically exported and saved into this folder.
* **`generate_pdf.js`**: Script designed to render a target HTML file as an A4 PDF document.
* **`capture.js`**: Script designed to capture a high-resolution screenshot (image) from a target HTML file.

## Prerequisites

Make sure you've installed the necessary Node.js dependencies:

```bash
npm install
```

## How to use

### 1. Generating a PDF

1. Place your target HTML file (along with any styling/assets) into the `assets/` folder. For this example, let's assume your file is called `resume.html`.
2. Open your terminal in this project's root folder.
3. Run the following command, specifying the filename:

```bash
node generate_pdf.js resume.html
```

*Note: The script outputs an A4 formatted PDF. It will be saved as `output/resume.pdf`.*

**Optional - Custom Output Name**:
You can specify the name of the output PDF explicitly:

```bash
node generate_pdf.js resume.html custom_output_name.pdf
```

### 2. Capturing an Image (Screenshot)

1. Place your target HTML file into the `assets/` folder. For this example, let's assume it's `banner.html`.
2. Run the capture command:

```bash
node capture.js banner.html
```

*Note: By default, `capture.js` uses a viewport dimension of `2800x700` (which is useful for banners, etc.). You can modify the `viewport` size on line 11 of `capture.js` if you want a different sizing.*

**Optional - Custom Output Name**:
Like the PDF generator, you can set the exact output name:

```bash
node capture.js banner.html my_custom_banner.png
```

## Tips
* The scripts have built-in delays (`await page.waitForTimeout(...)`) and await `document.fonts.ready` to ensure that custom web fonts and animations have fully loaded before the PDF or render is generated. If your page takes longer to load complex styles, consider increasing the timeout!
* Use relative paths for images/stylesheets inside your HTML so it resolves perfectly inside the `assets/` folder (e.g., `<link rel="stylesheet" href="./style.css">`).
