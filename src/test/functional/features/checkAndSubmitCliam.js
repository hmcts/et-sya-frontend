Feature('Check Your Answers Skeletal Pages');
const test_url = '/check-your-answers';
const authPage = require('./authPage.js');
const { I } = inject();

Scenario('ET Check your answer: Submit Claim', () => {
  I.amOnPage(test_url);
  authPage.login();
  I.amOnPage(test_url);
  I.seeElement('#main-content');
  I.click('#main-form-submit');
  I.see('Your claim has been submitted');

  authPage.logout();
})
  .tag('@RET-1178')
  .tag(' @RET-BAT');

Scenario('ET Check your answer: Save as draft', () => {
  I.amOnPage(test_url);
  authPage.login();
  I.amOnPage(test_url);
  I.seeElement('#main-form-save-for-later');
  I.click('#main-form-save-for-later');
  I.see('Your claim has been saved');
  I.see('Continue with your claim');
  I.click('[href="/return-to-existing"]');
  I.see('Return to an existing claim');
  authPage.logout();
}).tag('@RET-1178');
