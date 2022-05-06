const testHeadlessBrowser = true;
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
module.exports = {
  testUrl,
  name: 'et-ui-functional',
  testHeadlessBrowser: true,
  tests: './features/**/checkyourAnswers.js',
  reportFolder: '../../../functional-output/functional/reports',
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
        args: [
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--allow-running-insecure-content',
          '--ignore-certificate-errors',
        ],
      },
    },
  },
};
