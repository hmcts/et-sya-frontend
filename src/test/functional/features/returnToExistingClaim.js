Feature('ET returing to an existing claim');
const { I } = inject();
const loginIdam = require('../authUser/loginIdam.js');
const data = require('../data.json');

Scenario('Verify returing to an existing claim flow when application number existed', async () => {
  I.amOnPage('/');
  I.see('Make a claim to an employment tribunal');
  I.see('Return to an existing claim');
  I.click('Return to an existing claim');

  I.wait(3);
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);
  I.amOnPage('/return-to-existing');
  I.see('Return to an existing claim');
  I.see('I’ve got a ‘save and return number’');
  I.checkOption('input[id=return_number_or_account]');
  I.click('Continue');
  I.amOnPage('/logout');
});

Scenario('Verify returing to an existing claim flow when got a new ET account', async () => {
  I.amOnPage('/');
  I.see('Make a claim to an employment tribunal');
  I.see('Return to an existing claim');
  I.click('Return to an existing claim');

  I.wait(3);
  loginIdam.signInWithCredentials(data.signIn.username, data.signIn.password);
  I.wait(3);
  I.amOnPage('/return-to-existing');

  I.see('Return to an existing claim');
  I.see('I’ve got a new ‘Employment Tribunal account’');
  I.checkOption('input[id=return_number_or_account-2]');
  I.click('Continue');
  I.amOnPage('/logout');
}).tag(' @RET-BAT');
