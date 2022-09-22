'use strict';
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (noticePeriod, newJob, noticePeriodLength) {
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

  //employment end date
  I.seeElement('#end-date-day');
  I.fillField('#end-date-day', '20');
  I.fillField('#end-date-month', '04');
  I.fillField('#end-date-year', '2022');
  I.click(commonConfig.saveAndContinue);

  //Did you work a notice period page
  if (noticePeriod === 'Yes') {
    I.seeElement('#notice-period');
    I.checkOption('#notice-period');
    I.click(commonConfig.saveAndContinue);
    //if statement to select between weeks and months for notice period
    if (noticePeriodLength === 'Weeks') {
      I.seeElement('#notice-type');
      I.checkOption('input[id=notice-type]');
      I.click(commonConfig.saveAndContinue);

      //enter how many weeks in your notice period
      I.seeElement('#notice-length');
      I.fillField('input[id=notice-length]', '4');
      I.click(commonConfig.saveAndContinue);
    } else if (noticePeriodLength === 'Months') {
      I.seeElement('#notice-type-2');
      I.checkOption('input[id=notice-type-2]');
      I.click(commonConfig.saveAndContinue);

      //enter how many Months in your notice period
      I.seeElement('#notice-length');
      I.fillField('input[id=notice-length]', '1');
      I.click(commonConfig.saveAndContinue);
    }
    //did not work a notice period
  } else if (noticePeriod === 'No') {
    I.seeElement('#notice-period-2');
    I.checkOption('#notice-period-2');
    I.click(commonConfig.saveAndContinue);
  }

  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click(commonConfig.saveAndContinue);

  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click(commonConfig.saveAndContinue);

  I.seeElement('#pension');
  I.checkOption('input[id=pension]');
  I.fillField('#pension-contributions', '200');
  I.click(commonConfig.saveAndContinue);

  I.seeElement('#employee-benefits');
  I.see('Did you receive any employee benefits?');
  I.checkOption('input[id=employee-benefits]');
  I.click(commonConfig.saveAndContinue);

  //enter if you got a new job
  if (newJob === 'Yes') {
    I.seeElement('#new-job');
    I.checkOption('#new-job');
    I.click(commonConfig.saveAndContinue);

    //enter start date for new job
    I.seeElement('#new-job-start-date-day');
    I.fillField('#new-job-start-date-day', '20');
    I.fillField('#new-job-start-date-month', '08');
    I.fillField('#new-job-start-date-year', '2024');
    I.click(commonConfig.saveAndContinue);

    //enter new job pay
    I.seeElement('#new-pay-before-tax');
    I.fillField('#new-pay-before-tax', '50000');
    I.checkOption('#new-job-pay-interval-3');
    I.click(commonConfig.saveAndContinue);
  } else if (newJob === 'No') {
    I.seeElement('#new-job-2');
    I.checkOption('#new-job-2');
    I.click(commonConfig.saveAndContinue);
  }

  //checks user is on the respondent-name page
  I.seeElement('#respondentName');
};
