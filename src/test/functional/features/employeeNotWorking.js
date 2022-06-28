Feature('ET pages while employee not working for organisation');
const testUrl = '/are-you-still-working';
const authPage = require('./authPage.js');
const { I } = inject();

Scenario('Pages while not working for the organisation', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#still-working-3');
  I.checkOption('input[id=still-working-3]');
  I.click('#main-form-submit');

  I.seeElement('#jobTitle');
  I.fillField('#jobTitle', 'Tester');
  I.click('#main-form-submit');

  I.seeElement('#startDate-day');
  I.fillField('#startDate-day', '20');
  I.fillField('#startDate-month', '04');
  I.fillField('#startDate-year', '2014');
  I.click('#main-form-submit');
  authPage.logout();
})
  .tag('@RET-1131')
  .tag(' @RET-BAT');
