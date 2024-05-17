module.exports = {
  TestUrl: process.env.TEST_URL || 'https://et-sya-pr-924.preview.platform.hmcts.net',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
  TestsPathToRun: process.env.E2E_TEST_PATH || './features/**/*js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETUser: process.env.TEST_CASE_USERNAME || 'et.citizen4UI@testmail.com',
  TestEnvETPassword: process.env.TEST_CASE_PASSWORD || 'Nagoya0102',
  TestWaitForVisibilityTimeLimit: 60,

  saucelabs: {
    browser: 'chrome',
    username: 'username',
    key: 'privatekey',
    tunnelId: 'reformtunnel',
    waitForTimeout: 20000,
    smartWait: 20000,
  },
};
