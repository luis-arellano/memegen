import { chromium } from 'playwright';

async function testBernieFix() {
  console.log('🔍 Testing Bernie Sanders template fix...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    // Navigate to templates page
    console.log('📍 Navigating to templates page...');
    await page.goto('http://localhost:3003/templates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Find Bernie Sanders template
    console.log('🔎 Looking for Bernie Sanders template...');
    const bernieCard = page.locator('a:has-text("Bernie Sanders")');
    await bernieCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Bernie Sanders template card found\n');

    // Check if image loaded successfully
    const bernieImage = bernieCard.locator('img');
    const imageSrc = await bernieImage.getAttribute('src');
    console.log(`📸 Bernie image URL: ${imageSrc}`);

    // Click on Bernie template
    console.log('👆 Clicking Bernie template...');
    await bernieCard.click();
    await page.waitForURL(/\/create\/.+/, { timeout: 5000 });
    console.log(`✅ Navigated to: ${page.url()}\n`);

    // Verify Bernie template loads in editor
    console.log('🖼️  Verifying Bernie template in editor...');
    const editorImage = page.locator('img[alt="Bernie Sanders"]').first();
    await editorImage.waitFor({ state: 'visible', timeout: 5000 });

    const editorImageSrc = await editorImage.getAttribute('src');
    console.log(`✅ Bernie image loaded in editor: ${editorImageSrc}\n`);

    // Take screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'screenshots/bernie-fix-verification.png', fullPage: true });
    console.log('✅ Screenshot saved\n');

    console.log('🎉 Bernie Sanders template is now working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/bernie-fix-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

testBernieFix()
  .then(() => {
    console.log('\n✅ Verification complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
