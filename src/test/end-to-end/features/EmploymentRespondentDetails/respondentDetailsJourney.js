const { enterRespondentDetailsJourney } = require('../../helpers/caseHelper');
const authPage = require('../WIP/authPage.js');
const testUrl = '/respondent/1/respondent-name';

Feature("Enter respondent details you're making the claim against");

Scenario('Respondent details - worked at address with acas certificate', async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await enterRespondentDetailsJourney(I, 'Yes', 'Yes');
  authPage.logout();
}).tag('@RET-WIP');

Scenario('Respondent details - worked at a different address without acas certificate', async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await enterRespondentDetailsJourney(I, 'No', 'No');
  authPage.logout();
}).tag('@RET-WIP');
