'use strict';
const testConfig = require('../../config.js');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  await I.waitForText('You do not have to complete your claim in one go', testConfig.TestWaitForTextTimeLimit);
  await I.click(commonConfig.continue);
};
