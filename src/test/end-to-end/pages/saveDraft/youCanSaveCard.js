'use strict';
const testConfig = require('../../config');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  await I.see('You do not have to complete your claim in one go');
  await I.click(commonConfig.continue);
};
