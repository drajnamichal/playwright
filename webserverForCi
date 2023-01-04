  ...
  
  // use localhost only for CI
  use: {
    baseURL: process.env.CI ? 'http://localhost:3000' : process.env.DEV_URL,
    screenshot: 'only-on-failure',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    viewport: {
      width: 1920,
      height: 1080,
    },
  },
  
  ...
  
 // Run your local dev server only for CI before starting the tests */
  webServer: process.env.CI
    ? {
        command: 'nx serve web',
        url: 'http://localhost:3000',
        timeout: 120 * 1000,
      }
    : undefined,
};
