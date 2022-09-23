async function doNotHaveToCompleteCard(I) {
  await I.youCanSaveCard();
}

async function didYouWorkForOrganisation(I, orgOption) {
  await I.didYouWorkForOrganisation(orgOption);
}

async function personalDetails(I) {
  await I.personalDetails();
}

async function stepsToMakingYourClaim(I) {
  await I.stepsToMakingYourClaim();
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

module.exports = {
  doNotHaveToCompleteCard,
  didYouWorkForOrganisation,
  personalDetails,
  stepsToMakingYourClaim,
  typeOfDiscrimination,
  whatHappenedToYou,
  ifClaimWasSuccessfull,
  whatCompensationAreYouSeeking,
};
