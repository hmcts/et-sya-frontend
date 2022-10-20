/*Feature('ET returing to an existing claim');
const { I } = inject();
const authPage = require('./authPage.js');

Scenario('Verify returing to an existing claim flow when application number existed', async () => {
  I.amOnPage('/');
  I.wait(2);
  I.see('Make a claim to an employment tribunal');
  I.see('Return to an existing claim');
  I.click('Return to an existing claim');

  authPage.login();
  I.amOnPage('/return-to-existing');
  I.seeElement('#return_number_or_account');
  I.see('Return to an existing claim');
  I.see('I’ve got a ‘save and return number’');
  I.checkOption('input[id=return_number_or_account]');
  I.click('Continue');
  authPage.logout();
});

Scenario('Verify returing to an existing claim flow when got a new ET account', async () => {
  I.amOnPage('/');
  I.see('Make a claim to an employment tribunal');
  I.see('Return to an existing claim');
  I.click('Return to an existing claim');

  authPage.login();
  I.amOnPage('/return-to-existing');

  I.seeElement('#return_number_or_account-2');
  I.see('Return to an existing claim');
  I.see('I’ve got a new ‘Employment Tribunal account’');
  I.checkOption('input[id=return_number_or_account-2]');
  I.click('Continue');
  authPage.logout();
}).tag(' @RET-BAT');*/
