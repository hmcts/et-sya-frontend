'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (orgOption) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.click('[href="/past-employer"]');
  if (orgOption === 'No') {
    I.click('#past-employer-2');
    I.click(commonConfig.saveAndContinue);
    I.see("What is the name of the respondent you're making the claim against?");
  }
  if (orgOption === 'Yes') {
    I.click('#past-employer');
    I.click(commonConfig.saveAndContinue);
    I.see("Are you still working for the organisation or person you're making your claim against?");
  }
};
