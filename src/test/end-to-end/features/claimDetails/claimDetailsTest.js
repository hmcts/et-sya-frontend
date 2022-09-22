const {
  doNotHaveToCompleteCard,
  stepsToMakingYourClaim,
  typeOfDiscrimination,
  whatHappenedToYou,
  ifClaimWasSuccessfull,
} = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');
const { I } = inject();

Feature('Enter claim details for a claim');

Scenario('Navigate Claim Details', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Describe what happened to you')]");
  await typeOfDiscrimination(I);
  await whatHappenedToYou(I);
  await ifClaimWasSuccessfull(I);
}).tag('@pats');
