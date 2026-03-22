const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

program
  .name('document-forge')
  .description('CLI tool to render HTML files and capture high-quality PDFs or images via Playwright.')
  .version('1.0.0');

// Helper to determine if input is a URL or a local file
function resolveTargetUrl(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  
  // Assume local file in assets folder
  const inputPath = path.resolve(__dirname, 'assets', input);
  if (!fs.existsSync(inputPath)) {
    console.error(chalk.red(`\n[ERROR] Could not find "${input}" inside the "assets" folder.`));
    process.exit(1);
  }
  return 'file:///' + inputPath.replace(/\\/g, '/');
}

// Ensure output directory exists before writing
const ensureOutputDirectory = () => {
    const outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
};

// PDF Command
program
  .command('pdf <input> [output]')
  .description('Generate an A4 PDF from an HTML file or URL')
  .option('-d, --dark', 'Render page in dark mode')
  .action(async (input, output, options) => {
    ensureOutputDirectory();
    let filename = output || (input.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, "") + ".pdf");
    if (!filename.endsWith('.pdf')) filename += '.pdf';
    
    const outputPath = path.resolve(__dirname, 'output', filename);
    const targetUrl = resolveTargetUrl(input);

    const spinner = ora(`Launching browser to render PDF...`).start();
    let browser;
    try {
      browser = await chromium.launch();
      const page = await browser.newPage();
      
      if (options.dark) {
        await page.emulateMedia({ colorScheme: 'dark' });
      }

      spinner.text = `Navigating to ${targetUrl}...`;
      await page.goto(targetUrl, { waitUntil: 'load' });
      
      spinner.text = 'Waiting for web fonts and resources to load...';
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3000); 
      
      spinner.text = 'Generating high-quality PDF...';
      await page.pdf({
          path: outputPath,
          format: 'A4',
          printBackground: true,
          margin: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      
      spinner.succeed(chalk.green(`Success! Final PDF exported to: `) + chalk.cyan(outputPath));
    } catch (err) {
      spinner.fail(chalk.red('An error occurred during PDF generation.'));
      console.error(err);
    } finally {
      if (browser) await browser.close();
    }
  });

// Image Command
program
  .command('image <input> [output]')
  .description('Capture a screenshot from an HTML file or URL')
  .option('-d, --dark', 'Render page in dark mode')
  .option('-w, --width <number>', 'Viewport width in pixels', '2800')
  .option('-h, --height <number>', 'Viewport height in pixels', '700')
  .action(async (input, output, options) => {
    ensureOutputDirectory();
    let filename = output || (input.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, "") + ".png");
    if (!filename.match(/\.(png|jpg|jpeg)$/)) filename += '.png';
    
    const outputPath = path.resolve(__dirname, 'output', filename);
    const targetUrl = resolveTargetUrl(input);

    const spinner = ora(`Launching browser to capture image...`).start();
    let browser;
    try {
      browser = await chromium.launch();
      const width = parseInt(options.width, 10);
      const height = parseInt(options.height, 10);
      
      const page = await browser.newPage({ viewport: { width, height } });
      
      if (options.dark) {
        await page.emulateMedia({ colorScheme: 'dark' });
      }
      
      spinner.text = `Navigating to ${targetUrl}...`;
      await page.goto(targetUrl, { waitUntil: 'load' });
      
      spinner.text = 'Waiting for web fonts and resources to load...';
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      
      spinner.text = 'Taking screenshot...';
      await page.screenshot({ path: outputPath });
      
      spinner.succeed(chalk.green(`Success! Image saved to: `) + chalk.cyan(outputPath));
    } catch (err) {
      spinner.fail(chalk.red('An error occurred during image capture.'));
      console.error(err);
    } finally {
      if (browser) await browser.close();
    }
  });

// Fallback execution
program.parse(process.argv);
