'use strict';
const testConfig = require('../../config');
const commonConfig = require('../../features/Data/commonConfig.json');

module.exports = async function (noticePeriodContract, noticePeriod) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const I = this;
  //check page title and enter job title
  I.see('Employment details');
  I.seeElement('#jobTitle');
  I.fillField('#jobTitle', 'Tester');
  I.click(commonConfig.saveAndContinue);

  //employment start date page
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#startDate-day', testConfig.TestWaitForTextTimeLimit);
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click(commonConfig.saveAndContinue);

  //employment if statement to select notice period within contract
  await I.scrollPageToBottom();
  await I.waitForVisible('.govuk-details__summary-text', testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#notice-period', testConfig.TestWaitForTextTimeLimit);
  if (noticePeriodContract === 'Yes written contract with notice period') {
    I.checkOption('input[id=notice-period]');
    I.click(commonConfig.saveAndContinue);
    if (noticePeriod === 'Weeks') {
      await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
      //I.waitForElement('#notice-type', testConfig.TestWaitForTextTimeLimit);
      I.checkOption('input[id=notice-type]');
      I.click(commonConfig.saveAndContinue);

      await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
      //I.waitForElement('#notice-length', testConfig.TestWaitForTextTimeLimit);
      I.fillField('input[id=notice-length]', '4');
      I.click(commonConfig.saveAndContinue);
    } else if (noticePeriod === 'Months') {
      await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
      //I.waitForElement('#notice-type-2', testConfig.TestWaitForTextTimeLimit);
      I.checkOption('input[id=notice-type-2]');
      I.click(commonConfig.saveAndContinue);

      await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
      //I.waitForElement('#notice-length', testConfig.TestWaitForTextTimeLimit);
      I.fillField('input[id=notice-length]', '1');
      I.click(commonConfig.saveAndContinue);
    }
  } else if (noticePeriodContract === 'No written contract with notice period') {
    I.checkOption('input[id=notice-period-2]');
    I.click(commonConfig.saveAndContinue);
  }
  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#avg-weekly-hrs', testConfig.TestWaitForTextTimeLimit);
  I.fillField('#avg-weekly-hrs', '20');
  I.click(commonConfig.saveAndContinue);

  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#pay-before-tax', testConfig.TestWaitForTextTimeLimit);
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click(commonConfig.saveAndContinue);

  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#pension', testConfig.TestWaitForTextTimeLimit);
  I.checkOption('input[id=pension]');
  I.fillField('#pension-contributions', '200');
  I.click(commonConfig.saveAndContinue);

  await I.waitForVisible("//span[contains(text(),'Contact us')]", testConfig.TestWaitForVisibilityTimeLimit);
  //I.waitForElement('#employee-benefits', testConfig.TestWaitForTextTimeLimit);
  I.see('Employee benefits');
  I.checkOption('input[id=employee-benefits]');
  I.click(commonConfig.saveAndContinue);
};
