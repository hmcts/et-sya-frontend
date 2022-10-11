'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.click('[href="/dob-details"]');
  I.waitForText('What is your date of birth?', 30);
  I.fillField('#dobDate-day', '01');
  I.fillField('#dobDate-month', '01');
  I.fillField('#dobDate-year', '2000');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('Sex and preferred title', 30);
  I.checkOption('#sex-3');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('What is your contact or home address?', 30);
  I.refreshPage();
  I.waitToHide('#address1', 10);
  I.dontSeeElement('#address1');
  I.fillField('#postcode', 'LS9 9HE');
  I.click('#findAddressButton');
  I.waitForEnabled('#selectAddressInput', 120);
  I.selectOption(
    '#selectAddressInput',
    '{"fullAddress":"3, SKELTON AVENUE, LEEDS, LS9 9HE","street1":"3 SKELTON AVENUE","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS9 9HE","country":"ENGLAND"}'
  );
  I.click(commonConfig.saveAndContinue);

  I.waitForText('What is your telephone number?', 30);
  I.click(commonConfig.saveAndContinue);

  I.waitForText('How would you like to be contacted about your claim?', 30);
  I.checkOption('#update-preference');
  I.click(commonConfig.saveAndContinue);

  I.checkOption('#hearingPreferences');
  I.click(commonConfig.saveAndContinue);

  I.waitForText(
    'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?',
    30
  );
  I.checkOption('#reasonableAdjustments-2');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('Have you completed this section?', 30);
  I.checkOption('#tasklist-check');
  I.click(commonConfig.saveAndContinue);
  I.waitForText('Steps to making your claim', 30);
};
