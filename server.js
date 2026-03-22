const express = require('express');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup multer mapping for uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', upload.single('htmlFile'), async (req, res) => {
  const { type, url, darkMode, width, height } = req.body;
  const file = req.file;

  if (!url && !file) {
    return res.status(400).json({ error: 'Please provide either a Live URL or upload an HTML file.' });
  }

  let browser;
  let targetUrl;

  try {
    if (file) {
      // Local file uploaded directly from browser
      targetUrl = 'file:///' + path.resolve(file.path).replace(/\\/g, '/');
    } else {
      // Live URL provided via Input text
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
          targetUrl = 'https://' + url;
      } else {
          targetUrl = url;
      }
    }

    browser = await chromium.launch();
    
    // Default PDF Viewport dimensions
    let viewport = { width: 1920, height: 1080 };
    if (type === 'image') {
      viewport.width = parseInt(width, 10) || 2800;
      viewport.height = parseInt(height, 10) || 700;
    }

    const page = await browser.newPage({ viewport });

    if (darkMode === 'true') {
      await page.emulateMedia({ colorScheme: 'dark' });
    }

    await page.goto(targetUrl, { waitUntil: 'load' });
    
    // Safety check waiting for fonts to resolve before render
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000); 

    let buffer;
    let baseFilename = file ? file.originalname.replace(/\.[^/.]+$/, "") : url.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (!baseFilename) baseFilename = 'document';
    
    let filename = baseFilename;
    let contentType;

    if (type === 'pdf') {
       buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      filename += '.pdf';
      contentType = 'application/pdf';
    } else {
       buffer = await page.screenshot();
       filename += '.png';
       contentType = 'image/png';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to generate file.' });
  } finally {
    if (browser) await browser.close();
    // Intelligently clean up the uploaded temporary file after use to conserve space
    if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
