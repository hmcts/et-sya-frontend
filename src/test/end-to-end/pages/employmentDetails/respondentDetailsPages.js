'use strict';
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
  I.fillField('#postcode', 'LS7 4QE');
  I.click('#findAddressButton');
  I.waitForVisible('#selectAddressInput');
  I.selectOption(
    '#selectAddressInput',
    '{"fullAddress":"7, VALLEY GARDENS, LEEDS, LS7 4QE","street1":"7 VALLEY GARDENS","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS7 4QE","country":"ENGLAND"}'
  );
  I.click(commonConfig.saveAndContinue);

  //enter address for another location
  I.see('Did you work at 7 VALLEY GARDENS?');
  //Did you work at address or another
  if (workAddress === 'Yes') {
    I.seeElement('#work-address');
    I.checkOption('#work-address');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#acasCert');
  } else if (workAddress === 'No') {
    I.checkOption('#work-address-2');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#postcode');
    I.fillField('#postcode', 'LS14 1AR');
    I.click('#findAddressButton');
    I.waitForEnabled('#selectAddressInput', 120);
    I.selectOption(
      '#selectAddressInput',
      '{"fullAddress":"25, RINGWOOD DRIVE, LEEDS, LS14 1AR","street1":"25 RINGWOOD DRIVE","street2":"","town":"LEEDS","county":"LEEDS","postcode":"LS14 1AR","country":"ENGLAND"}'
    );
    I.click(commonConfig.saveAndContinue);
    I.waitForEnabled('#acasCert', 30);
  }

  //select yes or no for acas certificate
  if (doYouHaveAcas === 'Yes') {
    //I.seeElement('#acasCert');
    I.checkOption('#acasCert');
    I.waitForVisible('#acasCertNum');
    I.fillField('#acasCertNum', 'R123456/12/23');
    I.click(commonConfig.saveAndContinue);
  } else if (doYouHaveAcas === 'No') {
    I.checkOption('#acasCert-2');
    I.click(commonConfig.saveAndContinue);
    I.see('Why do you not have an Acas number?');
    I.checkOption('#no-acas-reason');
    I.click(commonConfig.saveAndContinue);
  }
  //check respondent details page
  I.see('Check the respondent details');
  I.click(commonConfig.saveAndContinue);

  //confirm completed section
  I.see('Have you completed this section?');
  I.seeElement('#tasklist-check');
  I.checkOption('#tasklist-check');
  I.click(commonConfig.saveAndContinue);
};
