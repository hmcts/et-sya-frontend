Feature('ET Claim while serving notice period for organisation');
const testUrl = '/are-you-still-working';
const { I } = inject();

Scenario('Claim while on notice for organisation', () => {
  I.amOnPage(testUrl);
  I.seeElement('#still-working-2');
  I.checkOption('input[id=still-working-2]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment start date');
  I.click('#main-form-submit');
  I.see('Enter your employment start date.');
  I.fillField('#start-date-day', '20');
  I.fillField('#start-date-month', '04');
  I.fillField('#start-date-year', '2014');
  I.click('#main-form-submit');

  I.see('notice end');
  I.click('#main-form-submit');

  I.see('notice pay');
  I.click('#main-form-submit');

  I.see('What are your average weekly hours?');
  I.seeElement('#avg-weekly-hrs');
  I.fillField('#avg-weekly-hrs', '20');
  I.click('#main-form-submit');

  I.see('Pay BEFORE tax');
  I.seeElement('#pay-before-tax');
  I.fillField('#pay-before-tax', '40000');
  I.checkOption('input[id=pay-before-tax-interval-3]');
  I.click('#main-form-submit');

  I.see('Pay AFTER tax');
  I.seeElement('#pay-after-tax');
  I.fillField('#pay-after-tax', '35000');
  I.checkOption('input[id=pay-after-tax-interval-3]');
  I.click('#main-form-submit');

  I.see('Pension scheme');
  I.seeElement('#pension-2');
  I.checkOption('input[id=pension-2]');
  I.click('#main-form-submit');

  I.seeElement('#employee-benefits');
  I.see('Do or did you receive any employee benefits?');
  I.checkOption('input[id=employee-benefits]');
  I.click('#main-form-submit');
}).tag('@RET-1131');
