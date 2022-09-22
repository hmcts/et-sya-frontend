const { doNotHaveToCompleteCard, didYouWorkForOrganisation } = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');

Feature('Enter employment and respondent details for claim');

Scenario("Did you work for the organisation or person you're making your claim against? - NO", async ({ I }) => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await didYouWorkForOrganisation(I, 'No');
}).tag('@RET-BAT');

Scenario("Did you work for the organisation or person you're making your claim against? - YES", async ({ I }) => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await didYouWorkForOrganisation(I, 'Yes');
}).tag('@RET-BAT');
