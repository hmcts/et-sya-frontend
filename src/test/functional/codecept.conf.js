const testConfig = require('./config.js');
exports.config = {
  tests: testConfig.tests,
  output: testConfig.reportFolder,
  helpers: testConfig.helpers,
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
          reportDir: testConfig.reportFolder,
          reportFilename: 'ET-sya-functional-tests',
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
