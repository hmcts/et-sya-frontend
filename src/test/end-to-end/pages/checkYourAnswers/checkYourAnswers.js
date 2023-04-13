'use strict';
const testConfig = require('../../config');
const contactUs = require('../../helpers/contactUs.js');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //Application Details Section
  I.see('Check your answers');
  I.see('Application details');
  I.see('Claim type');
  I.see('Discrimination');
  I.see('Whistleblowing');

  //Your Details
  I.see('Your details');
  I.see('Date of birth');
  I.see('01-01-2000');
  I.see('Sex');
  I.see('Preferred title');
  I.see('Contact or home address');
  I.see('Telephone number');
  I.see('How would you like to be contacted?');
  I.see('Post');
  I.see('What language do you want us to use when we contact you?');
  I.see('English');
  I.see('If a hearing is required, what language do you want to speak at a hearing?');
  I.see('English');

  I.click("//span[contains(.,'Contact us')]");
  await contactUs.verifyContactUs();

  I.forceClick("//a[@id='submit-case-button']");
};
