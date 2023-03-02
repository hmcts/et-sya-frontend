module.exports = {
  TestUrl: process.env.TEST_URL || 'https://et-sya.aat.platform.hmcts.net',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || false,
  TestsPathToRun: process.env.E2E_TEST_PATH || './features/**/*js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETUser: process.env.TEST_CASE_USERNAME || '',
  TestEnvETPassword: process.env.TEST_CASE_PASSWORD || '',
  TestWaitForVisibilityTimeLimit: 300,

  saucelabs: {
    browser: 'chrome',
    username: 'username',
    key: 'privatekey',
    tunnelId: 'reformtunnel',
    waitForTimeout: 20000,
    smartWait: 20000,
  },
};
