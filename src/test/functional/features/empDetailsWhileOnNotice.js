Feature('ET Claim while serving notice period for organisation');
const testUrl = '/are-you-still-working';
const authPage = require('./authPage.js');
const { I } = inject();

Scenario('Claim while on notice for organisation', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#still-working-2');
  I.checkOption('#still-working-2');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');

  I.seeElement('#notice-dates-day');
  I.fillField('#notice-dates-day', '20');
  I.fillField('#notice-dates-month', '06');
  I.fillField('#notice-dates-year', '2023');
  I.click('#main-form-submit');

  I.seeElement('#notice-type');
  I.checkOption('#notice-type');
  I.click('#main-form-submit');

  I.seeElement('#notice-length');
  I.fillField('#notice-length', '20');
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
})
  .tag('@RET-1131')
  .tag('@RET-1023')
  .tag(' @RET-BAT');
