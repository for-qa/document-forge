const { chromium } = require('playwright');

(async () => {
    console.log('Launching browser to render high-quality PDF...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const fileUrl = 'file:///d:/Portfolio/gairik/GAIRIK_SINGHA_RESUME.html';
    console.log(`Navigating to ${fileUrl}`);
    await page.goto(fileUrl, { waitUntil: 'load' });
    
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);
    
    const outputPath = 'd:/Portfolio/gairik/Gairik_Singha_SDET_Resume.pdf';
    
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 }
    });
    
    console.log(`Success! Final PDF exported to: ${outputPath}`);
    await browser.close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
