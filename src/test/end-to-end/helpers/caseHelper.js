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

module.exports = {
  doNotHaveToCompleteCard,
  didYouWorkForOrganisation,
  enterPersonalDetails,
  areYouStillWorkingForOrg,
  stillWorkingForRespondentJourney,
  workingNoticePeriodForRespondentJourney,
  noLongerWorkingForRespondentJourney,
};
