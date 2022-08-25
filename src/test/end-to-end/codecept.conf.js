const testConfig = require('./config.js');

exports.config = {
  tests: testConfig.TestsPathToRun,
  output: testConfig.TestReportFolder,
  helpers: {
    Puppeteer: {
      url: testConfig.TestUrl,
      waitForTimeout: 10000,
      waitForAction: 2000,
      getPageTimeout: 30000,
      show: testConfig.TestShowBrowserWindow,
      waitForNavigation: 'networkidle0',
      headless: true,
      chrome: {
        ignoreHTTPSErrors: true,
        defaultViewport: {
          width: 1280,
          height: 960,
        },
        args: ['--no-sandbox', '--ignore-certificate-errors', '--window-size=1440,1400'],
      },
    },
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
