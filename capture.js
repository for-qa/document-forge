const { chromium } = require('playwright');

(async () => {
    console.log('Launching browser to capture banner...');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 2800, height: 700 } });
    
    const fileUrl = 'file:///d:/Portfolio/gairik/banner_v3.html';
    console.log(`Navigating to ${fileUrl}`);
    await page.goto(fileUrl);
    
    // Wait for fonts to load
    await page.waitForTimeout(2000);
    
    const outputPath = 'd:/Portfolio/gairik/LINKEDIN_BANNER_SDET.png';
    await page.screenshot({ path: outputPath });
    
    console.log(`Success! Banner saved to: ${outputPath}`);
    await browser.close();
})();
