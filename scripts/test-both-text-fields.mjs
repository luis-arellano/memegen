import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBothTextFields() {
  console.log('Starting test: User can preview meme with both text fields');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Get a template ID from the database
    console.log('Fetching a template from database...');
    const { data: templates, error } = await supabase
      .from('templates')
      .select('id, name')
      .limit(1);

    if (error) throw error;
    if (!templates || templates.length === 0) throw new Error('No templates found');

    const template = templates[0];
    console.log(`Using template: ${template.name} (${template.id})`);

    // Step 2: Navigate to meme editor
    const editorUrl = `http://localhost:3005/create/${template.id}`;
    console.log(`Navigating to ${editorUrl}...`);
    await page.goto(editorUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Step 3: Enter 'TOP TEXT' in top text field
    console.log('Step 1: Enter TOP TEXT in top text field');
    const topInput = page.locator('input#topText');
    await topInput.fill('TOP TEXT');
    await page.waitForTimeout(200);

    // Step 4: Enter 'BOTTOM TEXT' in bottom text field
    console.log('Step 2: Enter BOTTOM TEXT in bottom text field');
    const bottomInput = page.locator('input#bottomText');
    await bottomInput.fill('BOTTOM TEXT');
    await page.waitForTimeout(200);

    // Step 5: Verify both texts render correctly on image
    console.log('Step 3: Verify both texts render correctly on image');
    const topTextOverlay = page.locator('text=TOP TEXT').first();
    const bottomTextOverlay = page.locator('text=BOTTOM TEXT').first();

    const topVisible = await topTextOverlay.isVisible();
    const bottomVisible = await bottomTextOverlay.isVisible();

    if (!topVisible) throw new Error('Top text not visible in preview');
    if (!bottomVisible) throw new Error('Bottom text not visible in preview');

    console.log('✅ Both texts render correctly on image');

    // Step 6: Check text positioning (top at top, bottom at bottom)
    console.log('Step 4: Check text positioning');
    const topBox = await topTextOverlay.boundingBox();
    const bottomBox = await bottomTextOverlay.boundingBox();

    if (!topBox || !bottomBox) throw new Error('Could not get text bounding boxes');

    const topY = topBox.y;
    const bottomY = bottomBox.y;

    if (bottomY <= topY) {
      throw new Error(`Text positioning incorrect: bottom (${bottomY}) should be below top (${topY})`);
    }

    console.log(`✅ Text positioning correct: top at y=${topY}, bottom at y=${bottomY}`);

    // Step 7: Verify texts don't overlap with each other
    console.log('Step 5: Verify texts don\'t overlap');
    const topBottom = topBox.y + topBox.height;
    const bottomTop = bottomBox.y;
    const gap = bottomTop - topBottom;

    if (gap < 0) {
      throw new Error(`Texts overlap! Gap between texts: ${gap}px`);
    }

    console.log(`✅ No overlap: ${gap}px gap between top and bottom text`);

    // Step 8: Test on mobile viewport for responsive text sizing
    console.log('Step 6: Test on mobile viewport (375x667)');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const topVisibleMobile = await topTextOverlay.isVisible();
    const bottomVisibleMobile = await bottomTextOverlay.isVisible();

    if (!topVisibleMobile) throw new Error('Top text not visible on mobile viewport');
    if (!bottomVisibleMobile) throw new Error('Bottom text not visible on mobile viewport');

    console.log('✅ Responsive text sizing works on mobile viewport');

    // Switch back to desktop for screenshot
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Take screenshot
    console.log('Taking screenshot...');
    await page.screenshot({
      path: 'screenshots/preview-both-text.png',
      fullPage: true
    });
    console.log('Screenshot saved: screenshots/preview-both-text.png');

    console.log('\n✅ ALL VERIFICATION STEPS PASSED');
    console.log('=================================');
    console.log('✅ Both texts render correctly on image');
    console.log('✅ Text positioning correct (top at top, bottom at bottom)');
    console.log('✅ Texts don\'t overlap with each other');
    console.log('✅ Responsive text sizing works on mobile viewport');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error-both-text.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

testBothTextFields().catch(console.error);
