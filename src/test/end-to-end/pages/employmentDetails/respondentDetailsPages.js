'use strict';
const testConfig = require('../../config.js');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (workAddress, doYouHaveAcas) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  //checks user is on respondent-name page and then enters a respondent name
  I.see("What is the name of the respondent you're making the claim against?");
  I.seeElement('#respondentName');
  I.fillField('#respondentName', 'Gabby Greta');
  I.click(commonConfig.saveAndContinue);

  //Enters Postcode for the respondent
  //I.seeElement('#postcode');
  I.refreshPage();
  I.waitToHide('#address1', 2);
  I.dontSeeElement('#address1');
  I.waitForElement('#respondentEnterPostcode', testConfig.TestWaitForVisibilityTimeLimit);
  I.fillField('#respondentEnterPostcode', 'LS7 4QE');
  I.click(commonConfig.saveAndContinue);
  I.waitForVisible('#respondentAddressTypes', 30);
  I.see('Select an address');
  I.see('No addresses found');
  I.click(commonConfig.saveAndContinue);
  I.fillField('#respondentAddress1', '7, Valley Gardens');
  I.fillField('#respondentAddress2', '');
  I.fillField('#respondentAddressTown', 'Leeds');
  I.fillField('#respondentAddressCountry', 'England');
  I.fillField('#respondentAddressPostcode', 'LS7 4QE');
  I.click(commonConfig.saveAndContinue);

  //enter address for another location
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Did you work at 7, Valley Gardens?');
  //Did you work at address or another
  if (workAddress === 'Yes') {
    await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
    I.seeElement('#work-address');
    I.checkOption('#work-address');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#acasCert');
  } else if (workAddress === 'No') {
    await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
    I.checkOption('#work-address-2');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#workEnterPostcode');
    I.fillField('#workEnterPostcode', 'LS14 1AR');
    I.click(commonConfig.saveAndContinue);
    I.waitForVisible('#workAddressTypes', 30);
    I.see('Select an address');
    I.see('No addresses found');
    I.click(commonConfig.saveAndContinue);
    I.fillField('#workAddress1', '25, Ringwood Drive');
    I.fillField('#workAddress2', '');
    I.fillField('#workAddressTown', 'Leeds');
    I.fillField('#workAddressCountry', 'England');
    I.fillField('#workAddressPostcode', 'LS14 1AR');
    I.click(commonConfig.saveAndContinue);
    await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  }

  //select yes or no for acas certificate
  if (doYouHaveAcas === 'Yes') {
    //I.seeElement('#acasCert');
    await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
    I.checkOption('#acasCert');
    I.waitForVisible('#acasCertNum');
    I.fillField('#acasCertNum', 'R123456/12/23');
    I.click(commonConfig.saveAndContinue);
  } else if (doYouHaveAcas === 'No') {
    await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
    I.checkOption('#acasCert-2');
    I.click(commonConfig.saveAndContinue);
    I.see(
      'Please note: incorrectly claiming an exemption may lead to your claim being rejected. If in doubt, please contact Acas.'
    );
    I.see('Why do you not have an Acas number?');
    I.checkOption('#no-acas-reason');
    I.click(commonConfig.saveAndContinue);
  }
  //check respondent details page
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Check the respondent details');
  I.click(commonConfig.saveAndContinue);

  //confirm completed section
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  I.see('Have you completed this section?');
  I.checkOption('#tasklist-check');
  I.click(commonConfig.saveAndContinue);
  I.wait(5);
};
