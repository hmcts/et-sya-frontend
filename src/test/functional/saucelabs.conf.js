const supportedBrowsers = require('./supportedBrowsers');
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  tags: ['ET'],
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(defaultSauceOptions, candidateCapabilities['sauce:options']);
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities,
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  tests: '../functional/features/*.js',
  output: 'functional/output',
  helpers: {
    WebDriver: {
      url: testUrl,
      browser: process.env.SAUCE_BROWSER || '',
      //host: process.env.HOST || 'saucelabs',
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {},
    },
    MyHelper: {
      require: './saucelabsHelper.js',
      url: testUrl,
    },
  },
  include: {
    I: './pages/steps.js',
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true },
      },
      mochawesome: {
        stdout: 'functional/output/console.log',
        options: {
          reportDir: '',
          reportName: 'index',
          inlineAssets: true,
        },
      },
    },
  },
  multiple: {
    chrome: {
      browsers: getBrowserConfig('chrome'),
    },
    firefox: {
      browsers: getBrowserConfig('firefox'),
    },
    safari: {
      browsers: getBrowserConfig('safari'),
    },
  },
  name: 'Employment Tribunal Crossbrowser Tests',
};

exports.config = setupConfig;
