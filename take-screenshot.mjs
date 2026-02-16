import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to localhost:3000
  await page.goto('http://localhost:3000');

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({ path: 'screenshots/nextjs-initialization.png', fullPage: true });

  console.log('Screenshot saved to screenshots/nextjs-initialization.png');

  await browser.close();
})();
