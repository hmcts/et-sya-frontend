Feature('Employee got a new job');
const testUrl = '/new-job';
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');
const { I } = inject();

Scenario('Employee details when he got a new job', () => {
  I.amOnPage(testUrl);
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);

  I.amOnPage(testUrl);

  I.see('Have you got a new job?');

  I.checkOption('input[id=new-job]');
  I.click('#main-form-submit');
  I.amOnPage('/logout');
})
  .tag('@RET-1170')
  .tag(' @RET-BAT');
