import { defineConfig, devices } from '@playwright/test';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './',
  testMatch: '*test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 6 : undefined,
  reporter: process.env.CI ? [['html'], ['list']] : [['list'], ['html']],
  timeout: 4 * 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },
  globalSetup: './config/global/global-setup',
  globalTeardown: './config/global/global-teardown',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup-chromium',
      testMatch: /user\.setups\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // Logins are independent; cap concurrency to keep the load on IDAM modest.
      workers: 2,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ['setup-chromium'],
    },

    {
      name: 'setup-fire-fox',
      testMatch: /user\.setups\.ts/,
      use: { ...devices['Desktop Firefox'] },
      // Logins are independent; cap concurrency to keep the load on IDAM modest.
      workers: 2,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
      dependencies: ['setup-fire-fox'],
    },

    {
      name: 'setup-webkit',
      testMatch: /user\.setups\.ts/,
      use: { ...devices['Desktop Safari'] },
      // Logins are independent; cap concurrency to keep the load on IDAM modest.
      workers: 2,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 } },
      dependencies: ['setup-webkit'],
    },
  ],
});
