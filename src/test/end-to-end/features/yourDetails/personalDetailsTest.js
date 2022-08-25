const { doNotHaveToCompleteCard, personalDetails } = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');
const { I } = inject();

Feature('Enter user details for claim');

Scenario('Navigate to Personal Details', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await personalDetails(I);
}).tag('@WIP');
