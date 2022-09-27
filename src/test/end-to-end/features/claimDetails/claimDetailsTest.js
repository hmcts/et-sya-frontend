const { doNotHaveToCompleteCard, stepsToMakingYourClaim, claimDetails } = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');
const { I } = inject();

Feature('Enter claim details for a claim');

Scenario('Navigate Claim Details - Describe What happenned to you', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Describe what happened to you')]");
  await claimDetails(I);
}).tag('@pats');

Scenario('Navigate Claim Details - Tell us what you want from your claim', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Tell us what you want from your claim')]");
  await claimDetails(I, false);
}).tag('@pats');
