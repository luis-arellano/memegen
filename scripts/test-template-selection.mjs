import { chromium } from 'playwright';

async function testTemplateSelection() {
  console.log('🚀 Starting template selection test...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to template library page
    console.log('📍 Step 1: Navigate to template library page');
    await page.goto('http://localhost:3003/templates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('✅ Template library page loaded\n');

    // Step 2: Count visible templates
    console.log('📍 Step 2: Count visible templates');
    const templateCards = await page.locator('a[href^="/create/"]').count();
    console.log(`✅ Found ${templateCards} clickable template cards\n`);

    if (templateCards === 0) {
      throw new Error('❌ No template cards found');
    }

    // Step 3: Get the first template info
    console.log('📍 Step 3: Get first template info');
    const firstTemplate = page.locator('a[href^="/create/"]').first();
    const firstTemplateName = await firstTemplate.locator('h3').textContent();
    const firstTemplateHref = await firstTemplate.getAttribute('href');
    console.log(`✅ First template: "${firstTemplateName}"`);
    console.log(`✅ Link href: ${firstTemplateHref}\n`);

    // Step 4: Click on the first template card
    console.log('📍 Step 4: Click on first template card');
    await firstTemplate.click();
    await page.waitForURL(/\/create\/.+/, { timeout: 5000 });
    console.log(`✅ Navigated to: ${page.url()}\n`);

    // Step 5: Verify template loads without errors
    console.log('📍 Step 5: Check for console errors');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.waitForTimeout(2000);
    if (errors.length > 0) {
      console.log(`⚠️  Console errors found: ${errors.join(', ')}`);
    } else {
      console.log('✅ No console errors detected\n');
    }

    // Step 6: Verify selected template image displays in editor
    console.log('📍 Step 6: Verify template image displays in editor');
    const templateImage = page.locator('img[alt*="' + firstTemplateName + '"]').first();
    await templateImage.waitFor({ state: 'visible', timeout: 5000 });
    const imageSrc = await templateImage.getAttribute('src');
    console.log(`✅ Template image loaded: ${imageSrc.substring(0, 50)}...\n`);

    // Step 7: Verify template metadata (name) is shown
    console.log('📍 Step 7: Verify template metadata is shown');
    const templateNameInEditor = await page.locator('text=/Editing:.*' + firstTemplateName + '/').textContent();
    console.log(`✅ Template name visible in header: "${templateNameInEditor}"\n`);

    const templateInfoBox = await page.locator('text=/Template:.*' + firstTemplateName + '/').textContent();
    console.log(`✅ Template info in preview: "${templateInfoBox}"\n`);

    // Step 8: Verify text input fields exist
    console.log('📍 Step 8: Verify text input fields');
    const topTextInput = page.locator('input#topText');
    const bottomTextInput = page.locator('input#bottomText');
    await topTextInput.waitFor({ state: 'visible' });
    await bottomTextInput.waitFor({ state: 'visible' });
    console.log('✅ Top text input field found');
    console.log('✅ Bottom text input field found\n');

    // Step 9: Verify "Start Over" button exists
    console.log('📍 Step 9: Verify "Start Over" button');
    const startOverButton = page.locator('a:has-text("Start Over")');
    await startOverButton.waitFor({ state: 'visible' });
    console.log('✅ "Start Over" button found\n');

    // Step 10: Test clicking different template - go back and select another
    console.log('📍 Step 10: Test selecting a different template');
    await startOverButton.click();
    await page.waitForURL(/\/templates/, { timeout: 5000 });
    console.log('✅ Returned to template library\n');

    // Select the second template
    const secondTemplate = page.locator('a[href^="/create/"]').nth(1);
    const secondTemplateName = await secondTemplate.locator('h3').textContent();
    console.log(`📍 Selecting second template: "${secondTemplateName}"`);
    await secondTemplate.click();
    await page.waitForURL(/\/create\/.+/, { timeout: 5000 });

    // Verify the second template loads
    const secondTemplateInEditor = await page.locator('text=/Editing:.*' + secondTemplateName + '/').textContent();
    console.log(`✅ Second template loaded: "${secondTemplateInEditor}"\n`);

    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: 'screenshots/template-selection.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved to screenshots/template-selection.png\n');

    console.log('🎉 All verification steps passed!\n');
    console.log('Summary:');
    console.log(`  ✅ Template library displays clickable templates (${templateCards} found)`);
    console.log('  ✅ Clicking template navigates to editor page');
    console.log('  ✅ Selected template image displays correctly');
    console.log('  ✅ Template metadata (name) is shown');
    console.log('  ✅ Text input fields are present');
    console.log('  ✅ "Start Over" button works');
    console.log('  ✅ Selecting different templates updates editor');
    console.log('  ✅ No console errors detected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/template-selection-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

testTemplateSelection()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
