Feature('ET Claim while working for organisation');
const testUrl = '/are-you-still-working';
const { I } = inject();

Scenario('Claim while working for organisation when notice period is for 3 months', () => {
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment details');
  I.click('#main-form-submit');

  I.see('Have you got a notice period?');
  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.seeElement('#notice-period-unit-2');
  I.checkOption('input[id=notice-period-unit-2]');
  I.fillField('#notice-period-length', '3');
  I.click('#main-form-submit');

  I.see('average weekly hours');
  I.click('#main-form-submit');

  I.see('pay before tax');
  I.click('#main-form-submit');

  I.see('pay after tax');
  I.click('#main-form-submit');

  I.see('Pension scheme');
  I.seeElement('#pension');
  I.checkOption('input[id=pension]');
  I.click('#main-form-submit');

  I.see('benefits');
  I.click('#main-form-submit');
}).tag('@RET-1130');

Scenario('Claim while working for organisation when notice period is for 2 weeks', () => {
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment details');
  I.click('#main-form-submit');

  I.see('Have you got a notice period?');
  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.seeElement('#notice-period-unit');
  I.checkOption('input[id=notice-period-unit]');
  I.fillField('#notice-period-length', '2');
  I.click('#main-form-submit');

  I.see('average weekly hours');
  I.click('#main-form-submit');

  I.see('pay before tax');
  I.click('#main-form-submit');

  I.see('pay after tax');
  I.click('#main-form-submit');

  I.see('Pension scheme');
  I.seeElement('#pension-2');
  I.checkOption('input[id=pension-2]');
  I.click('#main-form-submit');

  I.see('benefits');
  I.click('#main-form-submit');
}).tag('@RET-1130');

Scenario('Claim while working for organisation when notice period selected as no', () => {
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment details');
  I.click('#main-form-submit');

  I.see('Have you got a notice period?');
  I.seeElement('#notice-period-2');
  I.checkOption('input[id=notice-period-2]');
  I.click('#main-form-submit');

  I.see('average weekly hours');
  I.click('#main-form-submit');

  I.see('pay before tax');
  I.click('#main-form-submit');

  I.see('pay after tax');
  I.click('#main-form-submit');

  I.see('Pension scheme');
  I.seeElement('#pension-2');
  I.checkOption('input[id=pension-2]');
  I.click('#main-form-submit');

  I.see('benefits');
  I.click('#main-form-submit');
}).tag('@RET-1130');

Scenario('Claim while working for organisation and not submitted details', () => {
  I.amOnPage(testUrl);
  I.seeElement('#still-working');
  I.checkOption('input[id=still-working]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment details');
  I.click('#main-form-submit');

  I.see('Have you got a notice period?');
  I.seeElement('#notice-period');
  I.checkOption('input[id=notice-period]');
  I.click('#main-form-submit');
  I.seeElement('#notice-period-unit-error');
  I.seeElement('#notice-period-length-error');
}).tag('@RET-1130');
