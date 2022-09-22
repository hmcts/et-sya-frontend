const { enterPersonalDetails } = require('../../helpers/caseHelper');
const authPage = require('../WIP/authPage');
const testUrl = '/steps-to-making-your-claim';
//const { I } = inject();

Feature('Enter user details for claim');

Scenario('Navigate to Personal Details', async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await enterPersonalDetails(I);
}).tag('@RET-WIP');
