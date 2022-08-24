Feature('Enter user details for claim');

const commonFlow = require('../../helpers/commonFlow.js');
const authPage = require('../WIP/authPage');
const { I } = inject();

Scenario('Navigate to Personal Details', async () => {
  await commonFlow.createSingleMyselfCase();
  authPage.login();
  await I.see('You do not have to complete your claim in one go');
  await I.click('Continue');
}).tag('@dh');
