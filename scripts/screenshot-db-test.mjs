import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to db-test page
  await page.goto('http://localhost:3000/db-test');

  // Wait for the page to load and the API call to complete
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({
    path: 'screenshots/supabase-connection.png',
    fullPage: true
  });

  console.log('Screenshot saved to screenshots/supabase-connection.png');

  await browser.close();
})();
