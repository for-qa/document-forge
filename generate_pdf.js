const { chromium } = require('playwright');
const path = require('path');

// Get filename from arguments or default to 'index.html'
const filename = process.argv[2] || 'index.html';
const outputFilename = process.argv[3] || (filename.replace(/\.[^/.]+$/, "") + ".pdf");

(async () => {
    console.log('Launching browser to render high-quality PDF...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Resolve paths to the local assets and output directories
    const inputPath = path.resolve(__dirname, 'assets', filename);
    const outputPath = path.resolve(__dirname, 'output', outputFilename);
    // Properly format the file URL for Windows/Unix paths
    const fileUrl = 'file:///' + inputPath.replace(/\\/g, '/');

    console.log(`Navigating to ${fileUrl}`);
    
    try {
        await page.goto(fileUrl, { waitUntil: 'load' });
    } catch (e) {
        console.error(`\n[ERROR] Failed to load ${fileUrl}.`);
        console.error(`Please ensure that "${filename}" exists inside the "assets" folder.\n`);
        throw e;
    }
    
    // Wait for fonts and network resources to stabilize
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000); 
    
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
