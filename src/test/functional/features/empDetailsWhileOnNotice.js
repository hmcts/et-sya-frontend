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

  I.see('Employment details');
  I.click('#main-form-submit');

  I.see('notice end');
  I.click('#main-form-submit');

  I.see('notice pay');
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
}).tag('@RET-1131');
