'use strict';
const contactUs = require('../../helpers/contactUs.js');

const whistleBlowingClaimsConfig = require('./whistleBlowingClaims.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.see('Whistleblowing claims');
  I.see("You've selected a whistleblowing claim, so you can request that we forward a");
  I.see("copy of your claim to a relevant regulator (also known as 'prescribed person') or");
  I.see('body.');
  I.see('We will notify the respondent if you choose for us to forward your claim but this');
  I.see('will not affect how we process your claim');
  I.see('Not all whistleblowing claims will have an appropriate regular or body');
  I.see('Find the relevant regulator or body (opens in a new window) for your type of');
  I.see('claim from this list');
  I.see('Do you want us to forward your whistleblowing claim to a relevant');
  I.see('regulator or body?');

  I.checkOption(whistleBlowingClaimsConfig.whistle_blowing_claims);
  I.fillField(whistleBlowingClaimsConfig.whistle_blowing_entity_name, 'N/A');

  I.click(whistleBlowingClaimsConfig.contact_us);
  I.wait(1);
  await contactUs.verifyContactUs();

  I.click('Save and continue');
};
