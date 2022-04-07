Feature('ET check new account loading page');
const test_url = '/type-of-claim';
const { I } = inject();
const loginIdam = require('../authUser/loginIdam.js');

Scenario('Verify new account loading page', () => {
  I.amOnPage(test_url);
  I.executeScript(function () {
    sessionStorage.clear();
  });
  I.see('What type of claim do you want to make?');
  I.checkOption('#typeOfClaim');
  I.click('#main-form-submit');

  loginIdam.signInWithCredentials();

  I.seeElement('(//a[@href="/steps-to-making-your-claim"])');
  I.see('You do not have to complete your claim in one go');
  I.executeScript(function () {
    sessionStorage.clear();
  });
}).tag('@RET-1028');
