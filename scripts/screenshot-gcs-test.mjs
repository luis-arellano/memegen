import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshot() {
  console.log('📸 Taking screenshot of GCS test page...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to GCS test page
    console.log('Navigating to http://localhost:3002/gcs-test...');
    await page.goto('http://localhost:3002/gcs-test', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    // Wait a moment for any animations
    await page.waitForTimeout(1000);

    // Take screenshot
    const screenshotPath = path.join(__dirname, '..', 'screenshots', 'gcs-upload.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`✓ Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('✗ Screenshot failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

takeScreenshot()
  .then(() => {
    console.log('\n✅ Screenshot complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
