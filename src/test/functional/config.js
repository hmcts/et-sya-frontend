const testHeadlessBrowser = true;
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
const test_case_username = process.env.TEST_CASE_USERNAME || '';
const test_case_password = process.env.TEST_CASE_PASSWORD || '';
module.exports = {
  testUrl,
  test_case_username,
  test_case_password,
  name: 'et-ui-functional',
  testHeadlessBrowser: true,
  tests: './features/**/*js',
  reportFolder: './functional-output/reports',
  helpers: {
    Puppeteer: {
      url: testUrl,
      waitForTimeout: 10000,
      waitForAction: 4000,
      getPageTimeout: 30000,
      show: !testHeadlessBrowser,
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true,
      headless: true,
      browser: 'chrome',
      chrome: {
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--ignore-certificate-errors'],
      },
    },
  },
};
