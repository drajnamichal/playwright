const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  // use: {
  //   // Tell all tests to load signed-in state from 'storageState.json'.
  //   storageState: './e2e/storageState.json'
  // },
  testDir: './e2e/tests',
  /* Maximum time one test can run for. */
  timeout: 80 * 1000,
  expect: {
    timeout: 5000,
  },
