module.exports = {
  TestUrl: process.env.TEST_URL || 'https://et-sya-pr-562.service.core-compute-preview.internal',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
  TestsPathToRun: process.env.E2E_TEST_PATH || './features/**/*js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETUser: process.env.TEST_CASE_USERNAME || '',
  TestEnvETPassword: process.env.TEST_CASE_PASSWORD || '',
  TestWaitForVisibilityTimeLimit: 30,

  saucelabs: {
    browser: 'chrome',
    username: 'username',
    key: 'privatekey',
    tunnelId: 'reformtunnel',
    waitForTimeout: 20000,
    smartWait: 20000,
  },
};
