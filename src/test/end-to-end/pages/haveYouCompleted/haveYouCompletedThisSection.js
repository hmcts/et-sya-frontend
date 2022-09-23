'use strict';
const contactUs = require('../../helpers/contactUs.js');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('Have you completed this section?');
  I.see('You can change your answers later.');
  I.see("Yes, I've completed this section");
  I.see("No, I'll come back to it later");

  I.checkOption("//input[@id='claim-details-check']");

  I.click("//span[contains(.,'Contact us')]");
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};
