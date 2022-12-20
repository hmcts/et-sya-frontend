Feature('Have you completed this section for each task list');
const assert = require('assert');

const personal_details_test_url = '/personal-details-check';
const emp_respondent_test_url = '/employment-respondent-task-check';
const claim_details_test_url = '/claim-details-check';
const error_message_expected = 'Error: Tell us if you have completed this section';
const authPage = require('../WIP/authPage');

Scenario('No selection is made when completing your details section', async ({ I }) => {
  I.amOnPage(personal_details_test_url);
  authPage.login();
  I.amOnPage(personal_details_test_url);
  I.waitForElement('#tasklist-check');
  I.waitForText('Have you completed this section?', 30);
  I.click('#main-form-submit');
  I.waitForText('There is a problem', 5, '#error-summary-title');
  const error_message_actual = (await I.grabTextFrom('#tasklist-check-error')).trim();
  assert.equal(error_message_actual, error_message_expected, 'error message not matching expected');
  authPage.logout();
}).tag('@RET-BAT');

Scenario('No selection is made when completing employment and respondent section', async ({ I }) => {
  I.amOnPage(emp_respondent_test_url);
  authPage.login();
  I.amOnPage(emp_respondent_test_url);
  I.waitForElement('#tasklist-check');
  I.waitForText('Have you completed this section?', 30);
  I.click('#main-form-submit');
  I.waitForText('There is a problem', 5, '#error-summary-title');
  const error_message_actual = (await I.grabTextFrom('#tasklist-check-error')).trim();
  assert.equal(error_message_actual, error_message_expected, 'error message not matching expected');
  authPage.logout();
}).tag('@RET-BAT');

Scenario('No selection is made when completing claim details section', async ({ I }) => {
  I.amOnPage(claim_details_test_url);
  authPage.login();
  I.amOnPage(claim_details_test_url);
  I.waitForElement('#claim-details-check');
  I.waitForText('Have you completed this section?', 30);
  I.click('#main-form-submit');
  I.waitForText('There is a problem', 5, '#error-summary-title');
  //I.waitForText('Tell us if you have completed this section');
  const error_message_actual = (await I.grabTextFrom('#claim-details-check-error')).trim();
  assert.equal(error_message_actual, error_message_expected, 'error message not matching expected');
  authPage.logout();
}).tag('@RET-BAT');
