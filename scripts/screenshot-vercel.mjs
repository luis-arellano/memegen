import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to production URL...');
    await page.goto('https://memegen-rouge.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('Taking screenshot...');
    await page.screenshot({
      path: 'screenshots/vercel-deployment.png',
      fullPage: true
    });

    console.log('✓ Screenshot saved to screenshots/vercel-deployment.png');

    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Verify page loaded successfully
    const title = await page.title();
    console.log('✓ Page title:', title);

    if (errors.length > 0) {
      console.log('⚠️  Console errors detected:', errors);
    } else {
      console.log('✓ No console errors');
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
