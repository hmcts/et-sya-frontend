Feature('ET pages while employee not working for organisation');
const testUrl = '/are-you-still-working';
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
const { I } = inject();

Scenario('Pages while not working for the organisation', () => {
  I.amOnPage(testUrl);
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);
  I.seeElement('#still-working-2');
  I.checkOption('input[id=still-working-2]');
  I.click('#main-form-submit');

  I.seeElement('#job-title');
  I.fillField('#job-title', 'Tester');
  I.click('#main-form-submit');

  I.see('Employment start date');
  I.fillField('#start-date-day', '20');
  I.fillField('#start-date-month', '04');
  I.fillField('#start-date-year', '2014');
  I.click('#main-form-submit');
  I.amOnPage('/logout');
})
  .tag('@RET-1131')
  .tag(' @RET-BAT');
