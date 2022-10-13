module.exports = {
  TestUrl: process.env.TEST_E2E_URL || 'https://et-sya-pr-397.service.core-compute-preview.internal',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || false,
  TestsPathToRun: process.env.E2E_TEST_PATH || './features/**/*js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETUser: process.env.TEST_CASE_USERNAME || '',
  TestEnvETPassword: process.env.TEST_CASE_PASSWORD || '',
};
