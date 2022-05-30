Feature('ET Claim while serving notice period for organisation');
const testUrl = '/are-you-still-working';
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
const { I } = inject();

Scenario('Claim while on notice for organisation', () => {
  I.amOnPage(testUrl);

  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);

  I.seeElement('#still-working-2');
  I.checkOption('#still-working-2');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment start date');
  I.fillField('#start-date-day', '20');
  I.fillField('#start-date-month', '04');
  I.fillField('#start-date-year', '2014');
  I.click('#main-form-submit');

  I.see('When does your notice period end?');
  I.fillField('#notice-dates-day', '20');
  I.fillField('#notice-dates-month', '06');
  I.fillField('#notice-dates-year', '2014');
  I.click('#main-form-submit');

  I.checkOption('#notice-type');
  I.click('#main-form-submit');

  I.fillField('#notice-length', '20');
  I.click('#main-form-submit');

  I.see('What are your average weekly hours?');
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
  //I.fillField('input[id=pension-contributions]','100');
  I.click('#main-form-submit');

  I.seeElement('#employee-benefits');
  I.checkOption('input[id=employee-benefits]');
  I.click('#main-form-submit');
  I.amOnPage('/logout');
})
  .tag('@RET-1131')
  .tag('@RET-1023')
  .tag(' @RET-BAT');
