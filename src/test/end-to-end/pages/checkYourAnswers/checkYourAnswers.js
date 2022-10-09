'use strict';
const contactUs = require('../../helpers/contactUs.js');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

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

  I.click("//span[contains(.,'Contact us')]");
  //I.wait(1); //Commenting out the Explicit Waits and seeing if this works during pipeline execution....
  await contactUs.verifyContactUs();

  //await contactUs.clickSubmit();
  //await I.click('//a[@id=\'main-form-submit\']');
  //I.waitForText('Your claim has been submitted',60);
};
