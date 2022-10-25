const {
  doNotHaveToCompleteCard,
  stepsToMakingYourClaim,
  enterPersonalDetails,
  didYouWorkForOrganisation,
  areYouStillWorkingForOrg,
  stillWorkingForRespondentJourney,
  enterRespondentDetailsJourney,
  claimDetails,
  submittingClaim,
  checkYourAnswers,
  claimSubmitted,
} = require('../../helpers/caseHelper');
const commonFlow = require('../../helpers/commonFlow.js');

Feature('End to end journey for submitting a case');

Scenario('Submit a single claim for myself with the Complete PCQ/Equality', async ({ I }) => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I, false);
  await enterPersonalDetails(I);
  await didYouWorkForOrganisation(I, 'Yes');
  await areYouStillWorkingForOrg(I, 'Still working for respondent');
  await stillWorkingForRespondentJourney(I, 'Yes written contract with notice period', 'Months');
  await enterRespondentDetailsJourney(I, 'No', 'No');
  I.click("//a[contains(.,'Describe what happened to you')]");
  await claimDetails(I);
  await stepsToMakingYourClaim(I, true);
  await submittingClaim(I);
  await checkYourAnswers(I);
  await claimSubmitted(I);
})
  .tag('@RET-BAT')
  .tag('@RET-XB');

Scenario('Submit a single claim for myself without the Complete PCQ/Equality', async ({ I }) => {
  await commonFlow.createSingleMyselfCase();
  await I.authenticateWithIdam();
  await doNotHaveToCompleteCard(I);
  await stepsToMakingYourClaim(I, false);
  await enterPersonalDetails(I);
  await didYouWorkForOrganisation(I, 'Yes');
  await areYouStillWorkingForOrg(I, 'Still working for respondent');
  await stillWorkingForRespondentJourney(I, 'Yes written contract with notice period', 'Months');
  await enterRespondentDetailsJourney(I, 'No', 'No');
  I.click("//a[contains(.,'Describe what happened to you')]");
  await claimDetails(I);
  await stepsToMakingYourClaim(I, true);
  await submittingClaim(I, false);
  await checkYourAnswers(I);
  await claimSubmitted(I);
}).tag('@RET-BAT');
