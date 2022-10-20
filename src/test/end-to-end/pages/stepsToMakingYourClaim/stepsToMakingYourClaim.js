'use strict';
const testConfig = require('../../config');
const contactUs = require('../../helpers/contactUs.js');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Steps to making your claim');
  I.see('Application Details');
  I.see('Claim type');
  /*I.see('Discrimination');
  I.see('Whistleblowing');*/

  //Your details
  I.see('Your details');
  I.see('Personal details');
  I.see('Contact details');
  I.see('Your preferences');

  //Employment details
  I.see('Employment and respondent details');
  I.see('Employment status');
  I.see('Respondent details');

  //Claim details
  I.see('Claim details');
  I.see('Describe what happened to you');
  I.see('Tell us what you want from your claim');

  I.see('Check and submit');
  I.see('Check your answers');
  I.see('Contact us');

  I.click("//span[@class='govuk-details__summary-text']"); //As there are 2 Contact us Links on the Page...
  I.wait(1);
  await contactUs.verifyContactUs();
};
