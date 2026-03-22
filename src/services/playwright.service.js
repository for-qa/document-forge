const { chromium } = require('playwright');

class PlaywrightService {
  /**
   * Generates a PDF or Image snapshot via headless Chromium
   * @param {string} targetUrl The file:// or https:// URL to capture
   * @param {object} options Configuration for PDF or Image constraints
   * @returns {Promise<{buffer: Buffer, contentType: string, extension: string}>}
   */
  async generateDocument(targetUrl, options) {
    const { type, darkMode, width, height } = options;
    let browser;
    
    try {
      browser = await chromium.launch();
      
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
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000); 

      let buffer;
      let contentType;
      let extension;

      if (type === 'pdf') {
        buffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: 0, bottom: 0, left: 0, right: 0 }
        });
        contentType = 'application/pdf';
        extension = '.pdf';
      } else {
        buffer = await page.screenshot();
        contentType = 'image/png';
        extension = '.png';
      }

      return { buffer, contentType, extension };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

// Export singleton instance
module.exports = new PlaywrightService();
