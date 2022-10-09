const testConfig = require('./config.js');

exports.config = {
  tests: testConfig.TestsPathToRun,
  output: `${process.cwd()}/${testConfig.TestReportFolder}`,
  helpers: {
    Playwright: {
      url: testConfig.TestUrl,
      show: testConfig.TestShowBrowserWindow,
      restart: false,
      timeout: 5000,
      waitForNavigation: 'domcontentloaded',
      waitForTimeout: 10000,
      ignoreHTTPSErrors: true,
      windowSize: '1920x1080',
    },
    /*Puppeteer: {
      url: testConfig.TestUrl,
      waitForTimeout: 40000,
      getPageTimeout: 40000,
      //waitForAction: 1000,
      show: testConfig.TestShowBrowserWindow,
      waitForNavigation: ['domcontentloaded'],
      restart: true,
      keepCookies: false,
      keepBrowserState: false,
      chrome: {
        ignoreHTTPSErrors: true,
        'ignore-certificate-errors': true,
        'defaultViewport': {
          'width': 1280,
          'height': 960
        },
        args: [
          //'--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--allow-running-insecure-content',
          '--ignore-certificate-errors',
          '--window-size=1440,1400'
        ]
      },
    },*/
  },
  include: {
    I: './pages/steps.js',
  },
  mocha: {
    reporterEnabled: 'codeceptjs-cli-reporter, mochawesome',
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: false,
          steps: true,
        },
      },
      mochawesome: {
        stdout: './functional-output/console.log',
        options: {
          includeScreenshots: true,
          reportDir: testConfig.TestReportFolder,
          reportFilename: 'ET-sya-functional-tests',
          reportTitle: 'ET SYA Tests',
          inline: true,
          html: true,
          json: true,
        },
      },
    },
  },
  name: 'et-sya-functional-tests',
  plugins: {
    allure: {
      enabled: true,
    },
    pauseOnFail: {
      enabled: false,
    },
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
  },
};
