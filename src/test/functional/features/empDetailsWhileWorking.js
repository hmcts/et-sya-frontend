Feature('ET Claim while working for organisation');
const testUrl = '/are-you-still-working';
const authPage = require('./authPage.js');
const { I } = inject();

Scenario('Claim while working for organisation when notice period is for 3 months', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');

  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.click('#main-form-submit');

  I.seeElement('#notice-type');
  I.checkOption('input[id=notice-type]');
  I.click('#main-form-submit');

  I.seeElement('#notice-length');
  I.fillField('input[id=notice-length]', '4');
  I.click('#main-form-submit');

  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click('#main-form-submit');

  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click('#main-form-submit');

  I.seeElement('#pension');
  I.checkOption('input[id=pension]');
  I.fillField('#pension-contributions', '200');
  I.click('#main-form-submit');

  I.seeElement('#employee-benefits');
  I.see('Do or did you receive any employee benefits?');
  I.checkOption('input[id=employee-benefits]');
  I.click('#main-form-submit');
  authPage.logout();
})
  .tag('@RET-1130')
  .tag(' @RET-BAT');

Scenario('Claim while working for organisation when notice period is for 2 weeks', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');

  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.click('#main-form-submit');

  I.seeElement('#notice-type');
  I.checkOption('input[id=notice-type]');
  I.click('#main-form-submit');

  I.seeElement('#notice-length');
  I.fillField('input[id=notice-length]', '4');
  I.click('#main-form-submit');

  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click('#main-form-submit');

  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click('#main-form-submit');

  I.seeElement('#pension');
  I.checkOption('input[id=pension]');
  I.fillField('#pension-contributions', '200');
  I.click('#main-form-submit');

  I.seeElement('#employee-benefits');
  I.checkOption('input[id=employee-benefits]');
  I.click('#main-form-submit');
  authPage.logout();
}).tag('@RET-1130');

Scenario('Claim while working for organisation when notice period selected as no', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');

  I.seeElement('#notice-period-2');
  I.checkOption('input[id=notice-period-2]');
  I.click('#main-form-submit');

  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click('#main-form-submit');

  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-interval]');
  I.click('#main-form-submit');

  I.seeElement('#pension-2');
  I.checkOption('input[id=pension-2]');
  I.click('#main-form-submit');

  I.seeElement('#employee-benefits');
  I.checkOption('input[id=employee-benefits]');
  I.click('#main-form-submit');

  authPage.logout();
}).tag('@RET-1130');

Scenario('Claim while working for organisation and not submitted details', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');

  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.click('#main-form-submit');
  authPage.logout();
})
  .tag('@RET-1130')
  .tag(' @RET-BAT');

// No validation for Save as draft button at the moment
Scenario('Save as Draft: Still working for organisation', () => {
  I.amOnPage('/past-employer');
  authPage.login();
  I.amOnPage('/past-employer');

  I.seeElement('#main-form-submit');
  I.click('#main-form-submit');
  I.seeElement('[aria-labelledby="error-summary-title"]');
  I.see('There is a problem');
  I.checkOption('#past-employer');
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
  I.click('[class="govuk-back-link"]');
  I.click('#main-form-submit');
  I.see("Are you still working for the organisation or person you're making your claim against?");
  I.checkOption('#still-working');
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
  I.see('Continue with your claim');
  I.click('[class="govuk-back-link"]');
  I.checkOption('#still-working-2');
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
  I.see('Continue with your claim');
  I.click('[class="govuk-back-link"]');
  I.checkOption('#still-working-2');
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
  I.see('Continue with your claim');
  authPage.logout();
}).tag('@RET-1521');
