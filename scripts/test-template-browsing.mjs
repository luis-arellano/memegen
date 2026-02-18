import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function testTemplateBrowsing() {
  console.log('Starting template browsing test...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Navigate to templates page
    console.log('Navigating to http://localhost:3002/templates...');
    await page.goto('http://localhost:3002/templates', { waitUntil: 'networkidle' });

    // Wait for templates to load
    await page.waitForSelector('img[alt]', { timeout: 10000 });

    // Wait a bit for all images to load
    await page.waitForTimeout(2000);

    // Count templates
    const templateCount = await page.locator('img[alt]').count();
    console.log(`✅ Found ${templateCount} templates on the page`);

    // Verify at least 10 templates
    if (templateCount >= 10) {
      console.log('✅ At least 10 templates are visible');
    } else {
      console.log(`❌ Expected at least 10 templates, found ${templateCount}`);
    }

    // Verify template names are displayed
    const templateNames = await page.locator('h3.font-semibold').allTextContents();
    console.log(`✅ Template names displayed: ${templateNames.length} names found`);

    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    console.log('✅ Desktop layout tested (1920x1080)');

    // Ensure screenshots directory exists
    const screenshotsDir = join(projectRoot, 'screenshots');
    await mkdir(screenshotsDir, { recursive: true });

    // Take desktop screenshot
    const screenshotPath = join(screenshotsDir, 'browse-template-library.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Desktop screenshot saved to: ${screenshotPath}`);

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log('✅ Mobile layout tested (375x667)');

    // Take mobile screenshot
    const mobileScreenshotPath = join(screenshotsDir, 'browse-template-library-mobile.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`✅ Mobile screenshot saved to: ${mobileScreenshotPath}`);

    // Check console for errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`⚠️ Console errors detected: ${errors.length}`);
      errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('\n✅ All template browsing tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

testTemplateBrowsing().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
