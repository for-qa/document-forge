const { chromium } = require('playwright');
const path = require('path');

// Get filename from arguments or default to 'banner.html'
const filename = process.argv[2] || 'banner.html';
const outputFilename = process.argv[3] || (filename.replace(/\.[^/.]+$/, "") + ".png");

(async () => {
    console.log('Launching browser to capture image...');
    const browser = await chromium.launch();
    // Feel free to adjust the viewport dimensions as needed
    const page = await browser.newPage({ viewport: { width: 2800, height: 700 } });
    
    const inputPath = path.resolve(__dirname, 'assets', filename);
    const outputPath = path.resolve(__dirname, 'output', outputFilename);
    const fileUrl = 'file:///' + inputPath.replace(/\\/g, '/');

    console.log(`Navigating to ${fileUrl}`);
    try {
        await page.goto(fileUrl, { waitUntil: 'load' });
    } catch (e) {
        console.error(`\n[ERROR] Failed to load ${fileUrl}.`);
        console.error(`Please ensure that "${filename}" exists inside the "assets" folder.\n`);
        throw e;
    }
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: outputPath });
    
    console.log(`Success! Image saved to: ${outputPath}`);
    await browser.close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
