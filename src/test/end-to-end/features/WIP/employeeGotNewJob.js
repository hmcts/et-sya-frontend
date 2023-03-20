Feature('Employee got a new job');
const testUrl = '/new-job';
const authPage = require('./authPage.js');
const { I } = inject();

Scenario('Employee details when he got a new job', () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);

  I.seeElement('#new-job');
  I.checkOption('input[id=new-job]');
  I.click('#main-form-submit');
  authPage.logout();
}).tag('@RET-1170');
