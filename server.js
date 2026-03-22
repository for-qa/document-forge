const express = require('express');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to determine target URL
function resolveTargetUrl(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  // Assume local file in assets folder
  const inputPath = path.resolve(__dirname, 'assets', input);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Could not find "${input}" inside the assets folder.`);
  }
  return 'file:///' + inputPath.replace(/\\/g, '/');
}

app.post('/api/generate', async (req, res) => {
  const { type, url, darkMode, width, height } = req.body;
  if (!url) return res.status(400).json({ error: 'URL or filename is required.' });

  let browser;
  try {
    const targetUrl = resolveTargetUrl(url);
    browser = await chromium.launch();
    
    // For pdf defaults
    let viewport = { width: 1920, height: 1080 };
    if (type === 'image') {
      viewport.width = parseInt(width, 10) || 2800;
      viewport.height = parseInt(height, 10) || 700;
    }

    const page = await browser.newPage({ viewport });

    if (darkMode) {
      await page.emulateMedia({ colorScheme: 'dark' });
    }

    await page.goto(targetUrl, { waitUntil: 'load' });
    
    // Wait for fonts and network resources to stabilize
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000); 

    let buffer;
    let filename = url.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, "");
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
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
