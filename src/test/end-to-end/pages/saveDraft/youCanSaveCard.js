'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  await I.waitForVisible("//span[contains(text(),'Contact us')]");
  await I.see('You do not have to complete your claim in one go');
  await I.click(commonConfig.continue);
};
