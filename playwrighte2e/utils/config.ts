export const params = {
  TestUrlCitizenUi: process.env.TEST_URL || 'https://et-sya.aat.platform.hmcts.net',
  TestReportFolder: process.env.E2E_OUTPUT_DIR || './functional-output/reports',
  TestEnvETClaimantEmailAddress: process.env.TEST_CASE_USERNAME || '',
  TestEnvETClaimantPassword: process.env.TEST_CASE_PASSWORD || '',
};
