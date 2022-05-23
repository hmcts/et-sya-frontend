const testHeadlessBrowser = true;
const testUrl = 'https://et-sya-pr-233.service.core-compute-preview.internal';
module.exports = {
  testUrl,
  name: 'et-ui-functional',
  testHeadlessBrowser: true,
  tests: './features/**/employeeGotNewJob.js',
  reportFolder: './functional-output/reports',
  helpers: {
    Puppeteer: {
      url: testUrl,
      waitForTimeout: 10000,
      waitForAction: 2000,
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
