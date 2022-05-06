const testConfig = require('./config.js');
exports.config = {
  name: testConfig.name,
  tests: testConfig.tests,
  output: testConfig.reportFolder,
  helpers: testConfig.helpers,
  include: {
    I: './pages/steps.js',
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true,
        },
      },
      mochawesome: {
        stdout: testConfig.logInfo,
        options: {
          reportDir: testConfig.reportFolder,
          reportName: 'index',
          inlineAssets: true,
        },
      },
    },
  },
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
