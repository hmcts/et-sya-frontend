const {
  doNotHaveToCompleteCard,
  stepsToMakingYourClaim,
  typeOfDiscrimination,
  whatHappenedToYou,
  ifClaimWasSuccessfull,
  whatCompensationAreYouSeeking,
  whatTribunalRecommendation,
  whistleBlowingClaims,
  haveYouCompletedThisSection,
} = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');
const { I } = inject();

Feature('Enter claim details for a claim');

Scenario('Navigate Claim Details - Describe What happenned to you', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Describe what happened to you')]");
  await typeOfDiscrimination(I);
  await whatHappenedToYou(I);
  await ifClaimWasSuccessfull(I);
  await whatCompensationAreYouSeeking(I);
  await whatTribunalRecommendation(I);
  await whistleBlowingClaims(I);
  await haveYouCompletedThisSection(I);
}).tag('@pats');

Scenario('Navigate Claim Details - Tell us what you want from your claim', async () => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Tell us what you want from your claim')]");
  await ifClaimWasSuccessfull(I);
  await whatCompensationAreYouSeeking(I);
  await whatTribunalRecommendation(I);
  await whistleBlowingClaims(I);
  await haveYouCompletedThisSection(I);
}).tag('@pats');
