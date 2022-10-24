const logger = require('@pact-foundation/pact/src/common/logger');

const testConfig = require('./smoke.conf.js');
logger.info('codecept config s');
exports.config = {
  name: testConfig.name,
  tests: testConfig.tests,
  output: testConfig.reportFolder,
  helpers: testConfig.helpers,
  include: {
    I: './pages/steps.js',
  },
};
logger.info('codecept config f');
