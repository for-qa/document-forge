const playwrightService = require('../services/playwright.service');
const path = require('path');
const fs = require('fs');

class GenerateController {
  
  /**
   * Express Controller handling the request lifecycle for generation
   */
  async generate(req, res) {
    const { type, url, darkMode, width, height } = req.body;
    const file = req.file;

    try {
      if (!url && !file) {
        return res.status(400).json({ error: 'Please provide either a Live URL or upload an HTML file.' });
      }

      let targetUrl;
      let baseFilename;

      if (file) {
        // Local file attached via Multer
        targetUrl = 'file:///' + path.resolve(file.path).replace(/\\/g, '/');
        baseFilename = file.originalname.replace(/\.[^/.]+$/, "");
      } else {
        // Live URL provided via string
        targetUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          targetUrl = 'https://' + url;
        }
        baseFilename = url.replace(/[^a-zA-Z0-9.-]/g, '_');
      }

      if (!baseFilename) baseFilename = 'document';

      // Delegate core rendering to the Playwright Service
      const { buffer, contentType, extension } = await playwrightService.generateDocument(targetUrl, {
        type, 
        darkMode, 
        width, 
        height
      });

      // Format return file successfully
      const filename = `${baseFilename}${extension}`;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
      
    } catch (error) {
      console.error('[GenerateController Error]:', error);
      return res.status(500).json({ error: error.message || 'Failed to generate file.' });
    } finally {
      // Infrastructure cleanup (Single Responsibility Principle)
      if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
      }
    }
  }
}

// Export singleton instance
module.exports = new GenerateController();
