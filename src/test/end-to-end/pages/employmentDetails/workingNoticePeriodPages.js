'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (noticePeriodLength) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  //check page title and enter job title
  I.see('Employment details');
  I.seeElement('#jobTitle');
  I.fillField('#jobTitle', 'Tester');
  I.click(commonConfig.saveAndContinue);

  //employment start date page
  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click(commonConfig.saveAndContinue);

  //employment when does your notice period end page
  I.seeElement('#notice-dates-day');
  I.fillField('#notice-dates-day', '20');
  I.fillField('#notice-dates-month', '04');
  I.fillField('#notice-dates-year', '2025');
  I.click(commonConfig.saveAndContinue);

  //if statement to select between weeks and months for notice period
  I.seeElement('#notice-type');
  if (noticePeriodLength === 'Weeks') {
    I.checkOption('input[id=notice-type]');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#notice-length');
    I.fillField('input[id=notice-length]', '4');
    I.click(commonConfig.saveAndContinue);
  } else if (noticePeriodLength === 'Months') {
    I.checkOption('input[id=notice-type-2]');
    I.click(commonConfig.saveAndContinue);
    I.seeElement('#notice-length');
    I.fillField('input[id=notice-length]', '1');
    I.click(commonConfig.saveAndContinue);
  }
  //Enter average weekly hours
  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click(commonConfig.saveAndContinue);

  //Enter pay before tax
  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click(commonConfig.saveAndContinue);

  //Enter Pension details
  I.seeElement('#pension');
  I.checkOption('input[id=pension]');
  I.fillField('#pension-contributions', '200');
  I.click(commonConfig.saveAndContinue);

  //Did you receive any benefits
  I.seeElement('#employee-benefits');
  I.see('Employee benefits');
  I.checkOption('input[id=employee-benefits]');
  I.click(commonConfig.saveAndContinue);
};
