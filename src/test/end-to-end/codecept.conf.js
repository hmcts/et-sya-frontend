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
  },
  include: {
    I: './pages/steps.js',
    preLoginScreensWelsh: './pages/welsh/prelogin.welsh.page.js',
    loginPage: './pages/welsh/login.page.js',
    taskListPageWelsh: './pages/welsh/task.list.welsh.page.js',
    personalDetailsPageWelsh: './pages/welsh/personal.details.welsh.page.js',
    employmentAndRespondentPageWelsh: './pages/welsh/employment.and.respondent.details.welsh.page',
    claimDetailsPageWelsh: './pages/welsh/claim.details.welsh.page.js',
    submitClaimPageWelsh: './pages/welsh/submit.claim.welsh.page.js',
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
