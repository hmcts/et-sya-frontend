const testHeadlessBrowser = true;
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
module.exports = {
  testUrl: testUrl,
  name: 'et-ui-functional',
  testHeadlessBrowser: true,
  tests:'./features/**/*js',
  reportFolder: '../../../functional-output/functional/reports',
  helpers: {
    Puppeteer: {
      url: testUrl,
      waitForTimeout: 10000,
      waitForAction: 1000,
      show: !testHeadlessBrowser,
      browser: 'chromium',
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true,
      headless: !testHeadlessBrowser
    }
  }
}