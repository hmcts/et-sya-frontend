async function doNotHaveToCompleteCard(I) {
  await I.youCanSaveCard();
}

async function didYouWorkForOrganisation(I, orgOption) {
  await I.didYouWorkForOrganisation(orgOption);
}

async function enterPersonalDetails(I) {
  await I.personalDetails();
}

async function areYouStillWorkingForOrg(I, workingOption) {
  await I.areYouStillWorkingForOrganisation(workingOption);
}

async function stillWorkingForRespondentJourney(I, noticePeriodContract, noticePeriod) {
  await I.stillWorkingJourney(noticePeriodContract, noticePeriod);
}

async function workingNoticePeriodForRespondentJourney(I, noticePeriodLength) {
  await I.workingNoticePeriodJourney(noticePeriodLength);
}

async function noLongerWorkingForRespondentJourney(I, noticePeriod, newJob, noticePeriodLength) {
  await I.noLongerWorkingJourney(noticePeriod, newJob, noticePeriodLength);
}

async function enterRespondentDetailsJourney(I, workAddress, doYouHaveAcas) {
  await I.respondentDetailsJourney(workAddress, doYouHaveAcas);
}

async function stepsToMakingYourClaim(I) {
  await I.stepsToMakingYourClaim();
}

async function claimDetails(I, allClaimDetailsPages = true) {
  await I.claimDetails(allClaimDetailsPages);
}

async function typeOfDiscrimination(I) {
  await I.typeOfDiscrimination();
}

async function whatHappenedToYou(I) {
  await I.whatHappenedToYou();
}

async function ifClaimWasSuccessfull(I) {
  await I.ifClaimWasSuccessfull();
}

async function whatCompensationAreYouSeeking(I) {
  await I.whatCompensationAreYouSeeking(I);
}

async function whatTribunalRecommendation(I) {
  await I.whatTribunalRecommendation(I);
}

async function whistleBlowingClaims(I) {
  await I.whistleBlowingClaims(I);
}

async function haveYouCompletedThisSection(I) {
  await I.haveYouCompletedThisSection(I);
}

async function submittingClaim(I) {
  I.submitClaim(I);
}

async function checkYourAnswers(I) {
  await I.checkYourAnswers(I);
}

async function claimSubmitted(I) {
  await I.claimSubmitted(I);
}

module.exports = {
  doNotHaveToCompleteCard,
  didYouWorkForOrganisation,
  enterPersonalDetails,
  areYouStillWorkingForOrg,
  stillWorkingForRespondentJourney,
  workingNoticePeriodForRespondentJourney,
  noLongerWorkingForRespondentJourney,
  enterRespondentDetailsJourney,
  stepsToMakingYourClaim,
  typeOfDiscrimination,
  whatHappenedToYou,
  ifClaimWasSuccessfull,
  whatCompensationAreYouSeeking,
  whatTribunalRecommendation,
  whistleBlowingClaims,
  haveYouCompletedThisSection,
  claimDetails,
  submittingClaim,
  checkYourAnswers,
  claimSubmitted,
};
