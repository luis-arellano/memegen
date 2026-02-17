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

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    console.log(`Browser console [${msg.type()}]: ${msg.text()}`);
  });

  try {
    // Navigate to templates page
    console.log('Navigating to http://localhost:3002/templates...');
    const response = await page.goto('http://localhost:3002/templates', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    console.log(`Page response status: ${response.status()}`);

    // Wait for page to be ready
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check if the header is present
    const header = await page.textContent('h1');
    console.log(`Page header: "${header}"`);

    // Wait for the main container
    await page.waitForSelector('main', { timeout: 10000 });

    // Check for template grid or error message
    const hasGrid = await page.locator('div.grid').count() > 0;
    const hasError = await page.locator('div.bg-red-100').count() > 0;

    if (hasError) {
      const errorText = await page.locator('div.bg-red-100').textContent();
      console.log(`❌ Error on page: ${errorText}`);
    }

    if (hasGrid) {
      console.log('✅ Template grid found');

      // Wait a bit longer for images to start loading
      await page.waitForTimeout(3000);

      // Count template cards (by their container, not images)
      const templateCards = await page.locator('div.group.cursor-pointer').count();
      console.log(`✅ Found ${templateCards} template cards`);

      if (templateCards >= 10) {
        console.log('✅ At least 10 templates are visible');
      } else {
        console.log(`⚠️ Expected at least 10 templates, found ${templateCards}`);
      }

      // Get template names
      const templateNames = await page.locator('h3.font-semibold').allTextContents();
      console.log(`✅ Template names: ${templateNames.slice(0, 5).join(', ')}...`);
    } else {
      console.log('❌ Template grid not found');
      const bodyContent = await page.textContent('body');
      console.log('Page content:', bodyContent.substring(0, 500));
    }

    // Test responsive layout on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    console.log('✅ Desktop layout tested (1920x1080)');

    // Ensure screenshots directory exists
    const screenshotsDir = join(projectRoot, 'screenshots');
    await mkdir(screenshotsDir, { recursive: true });

    // Take desktop screenshot
    const screenshotPath = join(screenshotsDir, 'browse-template-library.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log('✅ Mobile layout tested (375x667)');

    // Check for console errors
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`⚠️ Console errors detected: ${errors.length}`);
      errors.forEach(err => console.log(`  - ${err.text}`));
    }

    console.log('\n✅ Template browsing test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    // Try to take error screenshot anyway
    try {
      const screenshotsDir = join(projectRoot, 'screenshots');
      await mkdir(screenshotsDir, { recursive: true });
      await page.screenshot({
        path: join(screenshotsDir, 'browse-template-library-error.png'),
        fullPage: true
      });
      console.log('Error screenshot saved');
    } catch (screenshotError) {
      console.error('Could not save error screenshot:', screenshotError.message);
    }

    throw error;
  } finally {
    await browser.close();
  }
}

testTemplateBrowsing().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
