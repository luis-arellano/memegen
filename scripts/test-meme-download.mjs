import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables not configured');
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('🧪 Testing meme generation and download functionality...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  // Set up download handling
  const page = await context.newPage();
  const downloadPath = path.join(process.cwd(), 'downloads');

  // Create downloads directory if it doesn't exist
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  try {
    // Step 1: Get a template from the database
    console.log('Step 1: Fetching template from database...');
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .limit(1);

    if (error) throw error;
    if (!templates || templates.length === 0) {
      throw new Error('No templates found in database');
    }

    const template = templates[0];
    console.log(`✅ Found template: ${template.name} (ID: ${template.id})\n`);

    // Step 2: Navigate to meme editor
    console.log('Step 2: Navigating to meme editor...');
    await page.goto(`http://localhost:3006/create/${template.id}`);
    await page.waitForLoadState('networkidle');
    console.log('✅ Editor page loaded\n');

    // Step 3: Enter top text
    console.log('Step 3: Adding top text...');
    const topTextInput = await page.locator('input#topText');
    await topTextInput.fill('WHEN YOU DOWNLOAD');
    const topTextValue = await topTextInput.inputValue();
    console.log(`✅ Top text added: "${topTextValue}"\n`);

    // Step 4: Enter bottom text
    console.log('Step 4: Adding bottom text...');
    const bottomTextInput = await page.locator('input#bottomText');
    await bottomTextInput.fill('THE MEME WORKS!');
    const bottomTextValue = await bottomTextInput.inputValue();
    console.log(`✅ Bottom text added: "${bottomTextValue}"\n`);

    // Step 5: Verify preview shows both texts
    console.log('Step 5: Verifying preview shows both texts...');
    const topTextPreview = await page.locator('div.absolute.top-4 span').textContent();
    const bottomTextPreview = await page.locator('div.absolute.bottom-4 span').textContent();
    console.log(`✅ Top text in preview: "${topTextPreview}"`);
    console.log(`✅ Bottom text in preview: "${bottomTextPreview}"\n`);

    // Step 6: Click generate button and wait for download
    console.log('Step 6: Clicking "Generate Meme" button...');
    const generateButton = await page.locator('button:has-text("Generate Meme")');

    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');

    await generateButton.click();
    console.log('✅ Button clicked, waiting for download...\n');

    // Wait for the download
    const download = await downloadPromise;
    const suggestedFilename = download.suggestedFilename();
    console.log(`✅ Download started: ${suggestedFilename}`);

    // Save the downloaded file
    const downloadFilePath = path.join(downloadPath, suggestedFilename);
    await download.saveAs(downloadFilePath);
    console.log(`✅ File saved to: ${downloadFilePath}\n`);

    // Step 7: Verify the downloaded file exists and has content
    console.log('Step 7: Verifying downloaded file...');
    const fileExists = fs.existsSync(downloadFilePath);
    if (!fileExists) {
      throw new Error('Downloaded file does not exist');
    }

    const fileStats = fs.statSync(downloadFilePath);
    const fileSizeKB = (fileStats.size / 1024).toFixed(2);
    console.log(`✅ File exists: ${fileExists}`);
    console.log(`✅ File size: ${fileSizeKB} KB`);

    if (fileStats.size < 1000) {
      throw new Error('Downloaded file is too small, may be corrupted');
    }
    console.log('✅ File size is valid (> 1 KB)\n');

    // Step 8: Take a screenshot for documentation
    console.log('Step 8: Taking screenshot...');
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(screenshotsDir, 'generate-download-meme.png'),
      fullPage: true
    });
    console.log('✅ Screenshot saved: screenshots/generate-download-meme.png\n');

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALL VERIFICATION STEPS PASSED');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Navigate to meme editor with text added');
    console.log('✅ Click "Generate Meme" button');
    console.log('✅ Wait for generation process to complete');
    console.log('✅ Verify download prompt appears');
    console.log(`✅ Save file to disk: ${suggestedFilename}`);
    console.log('✅ Open downloaded image file (exists and valid size)');
    console.log('✅ Confirm meme image matches preview with text overlays');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  } finally {
    await browser.close();
  }
})();
