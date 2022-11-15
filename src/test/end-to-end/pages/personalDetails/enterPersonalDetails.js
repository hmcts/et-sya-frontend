'use strict';
const testConfig = require('../../config.js');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  I.click('[href="/dob-details"]');

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('What is your date of birth?');
  I.fillField('#dobDate-day', '01');
  I.fillField('#dobDate-month', '01');
  I.fillField('#dobDate-year', '2000');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Sex and preferred title');
  I.checkOption('#sex-3');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('What is your contact or home address?');
  I.refreshPage();
  I.waitToHide('#address1', 10);
  I.dontSeeElement('#address1');
  I.fillField('#postcode', 'LS9 9HE');
  I.click('#findAddressButton');
  I.waitForVisible('#selectAddressInput', testConfig.TestWaitForTextTimeLimit);
  I.selectOption(
    '#selectAddressInput',
    '{"fullAddress":"3, SKELTON AVENUE, LEEDS, LS9 9HE","street1":"3, SKELTON AVENUE","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS9 9HE","country":"ENGLAND"}'
  );
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('What is your telephone number?');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('How would you like to be contacted about your claim?');
  I.checkOption('#update-preference');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.waitForElement('#hearingPreferences', testConfig.TestWaitForVisibilityTimeLimit);
  I.checkOption('#hearingPreferences');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see(
    'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?'
  );
  I.checkOption('#reasonableAdjustments-2');
  I.click(commonConfig.saveAndContinue);

  await I.scrollPageToBottom();
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Have you completed this section?');
  I.checkOption('#tasklist-check');
  I.click(commonConfig.saveAndContinue);
  I.wait(5);
};
