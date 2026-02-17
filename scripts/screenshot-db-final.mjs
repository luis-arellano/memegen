import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to db-test page
  await page.goto('http://localhost:3000/db-test', { waitUntil: 'networkidle' });

  // Wait for the success message to appear
  await page.waitForSelector('text=Connection Successful', { timeout: 10000 });

  // Wait a bit more for any animations
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({
    path: 'screenshots/supabase-connection.png',
    fullPage: true
  });

  console.log('Screenshot saved to screenshots/supabase-connection.png');

  await browser.close();
})();
