import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testDbConnection() {
  console.log('🔍 Testing database connection via browser...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the db-test page
    console.log('📄 Navigating to http://localhost:3002/db-test');
    await page.goto('http://localhost:3002/db-test', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the page to load and API call to complete
    console.log('⏳ Waiting for database test to complete...');
    await page.waitForTimeout(3000);

    // Check for success indicators
    const successElement = await page.locator('text=Connection Successful').count();
    const hasError = await page.locator('text=Connection Failed').count();

    console.log('\n📊 Test Results:');
    console.log(`   Success: ${successElement > 0 ? '✅' : '❌'}`);
    console.log(`   Error: ${hasError > 0 ? '❌' : '✅ (no errors)'}`);

    // Take screenshot
    const screenshotsDir = join(__dirname, '..', 'screenshots');
    if (!existsSync(screenshotsDir)) {
      mkdirSync(screenshotsDir, { recursive: true });
    }

    const screenshotPath = join(screenshotsDir, 'supabase-connection.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

    // Get page content for verification
    const pageText = await page.textContent('body');
    const hasTemplates = pageText.includes('Templates table');
    const hasMemes = pageText.includes('Memes table');

    console.log('\n✅ Verification:');
    console.log(`   Templates table mentioned: ${hasTemplates ? '✅' : '❌'}`);
    console.log(`   Memes table mentioned: ${hasMemes ? '✅' : '❌'}`);

    if (successElement > 0 && hasTemplates && hasMemes) {
      console.log('\n🎉 Database connection test PASSED!');
      return true;
    } else {
      console.log('\n⚠️  Database connection test needs review');
      return false;
    }

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testDbConnection().then(success => {
  process.exit(success ? 0 : 1);
});
