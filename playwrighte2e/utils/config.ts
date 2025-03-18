export const params = {
  TestUrlCitizenUi: process.env.TEST_URL || 'https://et-sya.aat.platform.hmcts.net',
  TestIdamUrl: process.env.IDAM_URL || 'https://idam-api.aat.platform.hmcts.net/testing-support/accounts',
  IdamAcccountUrl: process.env.IDAM_ACCOUNT_URL || 'https://idam-api.aat.platform.hmcts.net/testing-support/accounts',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
  TestsPathToRun: process.env.E2E_TEST_PATH || './**/*.js',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETClaimantEmailAddress: process.env.ET_CITIZEN_USER_NAME || '',
  TestEnvETClaimantPassword: process.env.ET_CITIZEN_PASSWORD || '',
  TestEnvETNewClaimantEmailAddress: process.env.ET_NEW_CITIZEN_USER_NAME || '',
  TestApiKey: process.env.API_KEY || '',
  TestEnv: process.env.RUNNING_ENV || '',
};
