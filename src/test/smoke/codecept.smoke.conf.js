const testConfig = require('./smoke.conf.js');
exports.config = {
  name: testConfig.name,
  tests: testConfig.tests,
  output: testConfig.reportFolder,
  helpers: testConfig.helpers,
  include: {
    // I: './pages/steps.js',
  },
};
