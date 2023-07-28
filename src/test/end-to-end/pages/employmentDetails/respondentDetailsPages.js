'use strict';
const testConfig = require('../../config.js');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (individual, workAddress, doYouHaveAcas) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;

  //checks user is on respondent-name page and then enters a respondent name
  I.see("What is the name of the respondent you're making the claim against?");
  I.see('Enter name of respondent');
  if (individual === 'Yes') {
    I.checkOption('#respondentType');
    I.fillField('#respondentFirstName', 'Gabby');
    I.fillField('#respondentLastName', 'Greta');
  } else {
    I.checkOption('#respondentType-2');
    I.fillField('#respondentOrganisation', 'Gabby Greta Inc');
  }
  I.click(commonConfig.saveAndContinue);

  //Enters Postcode for the respondent
  //I.seeElement('#postcode');
  I.refreshPage();
  I.waitForElement('#respondentEnterPostcode', testConfig.TestWaitForVisibilityTimeLimit);
  I.fillField('#respondentEnterPostcode', 'LS7 4QE');
  I.click(commonConfig.saveAndContinue);
  I.waitForVisible('#respondentAddressTypes', 30);
  I.see('Select an address');
  I.see('Several addresses found');
  I.selectOption('#respondentAddressTypes', '7, Valley Gardens, Leeds, LS7 4QE');
  I.click(commonConfig.saveAndContinue);
  I.see('What is the address of Gabby Greta?');
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
    I.see('Several addresses found');
    I.selectOption('#workAddressTypes', '25, Ringwood Drive, Leeds, LS14 1AR');
    I.click(commonConfig.saveAndContinue);
    I.see('What address did you work at?');
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
