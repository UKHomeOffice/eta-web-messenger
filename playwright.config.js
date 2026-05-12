const { defineConfig, devices } = require('@playwright/test');

const port = Number(process.env.PLAYWRIGHT_PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;

// Parallelization: fullyParallel enables parallel test execution within files.
// Ensure tests are independent and do not share state.
// For slow/history tests, keep them in separate files or use test.describe.serial.
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Optionally set workers: 4, // or another suitable number for your machine
  retries: process.env.CI ? 2 : 0,
  timeout: 90_000,
  expect: {
    timeout: 15_000
  },
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
      command: 'yarn dev',
      port,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
