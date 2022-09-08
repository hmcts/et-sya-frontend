'use strict';

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.click('[href="/dob-details"]');
  I.see('What is your date of birth?');
  I.fillField('#dobDate-day', '01');
  I.fillField('#dobDate-month', '01');
  I.fillField('#dobDate-year', '2000');
  I.click('#main-form-submit');
  I.see('Sex and preferred title');
  I.click('#main-form-submit');
  I.see('What is your contact or home address?');
  I.fillField('#postcode', 'ss11aa');
  I.click('#findAddressButton');
  I.selectOption(
    { css: 'select[name=selectAddress]' },
    'ROYAL MAIL, SOUTHEND-ON-SEA M L O, SHORT STREET, SOUTHEND-ON-SEA, SS1 1AA'
  );
  I.click('#main-form-submit');
  I.see('What is your telephone number?');
  I.click('#main-form-submit');
  I.see('How would you like to be contacted about your claim?');
  I.checkOption('#update-preference');
  I.click('#main-form-submit');
  I.checkOption('#hearingPreferences');
  I.click('#main-form-submit');
  I.see(
    'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?'
  );
  I.checkOption('#reasonableAdjustments-2');
  I.click('#main-form-submit');
  I.see('Have you completed this section?');
  I.checkOption('#tasklist-check');
  I.click('#main-form-submit');
  I.see('Steps to making your claim');
};
