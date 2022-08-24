module.exports = {
  TestUrl: process.env.TEST_E2E_URL || 'https://et-sya.aat.platform.hmcts.net',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
  TestsPathToRun: process.env.E2E_TEST_PATH || './features/**/*js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvCWUser: process.env.CASEWORKER_E2E_EMAIL || '',
  TestEnvCWPassword: process.env.CASEWORKER_E2E_PASSWORD || '',
};
