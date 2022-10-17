'use strict';
const testConfig = require('../../config.js');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.click('[href="/dob-details"]');
  I.waitForText('What is your date of birth?', testConfig.TestWaitForTextTimeLimit);
  I.fillField('#dobDate-day', '01');
  I.fillField('#dobDate-month', '01');
  I.fillField('#dobDate-year', '2000');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('Sex and preferred title', testConfig.TestWaitForTextTimeLimit);
  I.checkOption('#sex-3');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('What is your contact or home address?', testConfig.TestWaitForTextTimeLimit);
  I.refreshPage();
  I.waitToHide('#address1', 10);
  I.dontSeeElement('#address1');
  I.fillField('#postcode', 'LS9 9HE');
  I.click('#findAddressButton');
  I.waitForVisible('#selectAddressInput', testConfig.TestWaitForTextTimeLimit);
  I.selectOption(
    '#selectAddressInput',
    '{"fullAddress":"3, SKELTON AVENUE, LEEDS, LS9 9HE","street1":"3 SKELTON AVENUE","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS9 9HE","country":"ENGLAND"}'
  );
  I.click(commonConfig.saveAndContinue);

  I.waitForText('What is your telephone number?', testConfig.TestWaitForTextTimeLimit);
  I.click(commonConfig.saveAndContinue);

  I.waitForText('How would you like to be contacted about your claim?', testConfig.TestWaitForTextTimeLimit);
  I.checkOption('#update-preference');
  I.click(commonConfig.saveAndContinue);

  I.checkOption('#hearingPreferences');
  I.click(commonConfig.saveAndContinue);

  I.waitForText(
    'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?',
    testConfig.TestWaitForTextTimeLimit
  );
  I.checkOption('#reasonableAdjustments-2');
  I.click(commonConfig.saveAndContinue);

  I.waitForText('Have you completed this section?', testConfig.TestWaitForTextTimeLimit);
  I.checkOption('#tasklist-check');
  I.click(commonConfig.saveAndContinue);
  I.waitForText('Steps to making your claim', testConfig.TestWaitForTextTimeLimit);
};
