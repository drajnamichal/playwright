// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.DEV_URL);
  await page.getByTestId('signInUsername').fill(process.env.VALID_USER_EMAIL);
  await page.getByTestId('signInPassword').fill(process.env.VALID_USER_PASSWORD);
  await page.getByTestId('signInConfirmButton').click();
  // Save signed-in state to 'storageState.json'.
  await page.locator('(//div[@data-testid="topOpportunities"]//a)[1]').click();
  await page.context().storageState({ path: './e2e/storageState.json' });
  await browser.close();
}

export default globalSetup;
