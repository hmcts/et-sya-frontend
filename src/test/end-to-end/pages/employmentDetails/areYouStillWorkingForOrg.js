'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (workingOption) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  if (workingOption === 'Still working for respondent') {
    I.click('#still-working');
    I.click(commonConfig.saveAndContinue);
    I.see('Employment details');
  }
  if (workingOption === 'Working Notice Period for respondent') {
    I.click('#still-working-2');
    I.click(commonConfig.saveAndContinue);
    I.see('Employment details');
  }
  if (workingOption === 'No Longer working for respondent') {
    I.click('#still-working-3');
    I.click(commonConfig.saveAndContinue);
    I.see('Employment details');
  }
};
