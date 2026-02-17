import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function takeScreenshot() {
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 1024 });

    console.log('🔗 Navigating to templates test page...');
    await page.goto('http://localhost:3002/templates-test', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('⏳ Waiting for content to load...');
    // Wait for the templates to load
    await page.waitForSelector('h1:has-text("Template Database Verification")', {
      timeout: 10000
    });

    // Wait a bit for images to load
    await page.waitForTimeout(3000);

    console.log('📸 Taking screenshot...');
    const screenshotPath = join(__dirname, '..', 'screenshots', 'templates-seeded.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`✅ Screenshot saved to: ${screenshotPath}`);

    // Log any console errors from the page
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    if (logs.length > 0) {
      console.log('\n⚠️  Console errors detected:');
      logs.forEach(log => console.log(`   ${log}`));
    } else {
      console.log('✅ No console errors detected');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('✅ Browser closed');
  }
}

takeScreenshot().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
