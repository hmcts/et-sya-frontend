const testHeadlessBrowser = true;
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
const ignoreHTTPSErrors = true;
module.exports = {
  testUrl,
  name: 'et-ui-functional',
  testHeadlessBrowser: true,
  tests: './features/**/*js',
  reportFolder: '../../../functional-output/functional/reports',
  helpers: {
    Puppeteer: {
      url: testUrl,
      waitForTimeout: 10000,
      waitForAction: 2000,
      getPageTimeout: 30000,
      show: !testHeadlessBrowser,
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors,
      headless: true,
      chrome: {
        ignoreHTTPSErrors,
        args: ['--no-sandbox', '--proxy-server=proxyout.reform.hmcts.net:8080'],
      },
    },
  },
};
