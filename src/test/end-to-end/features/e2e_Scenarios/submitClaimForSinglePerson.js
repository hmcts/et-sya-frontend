// const {
//   doNotHaveToCompleteCard,
//   didYouWorkForOrganisation,
//   areYouStillWorkingForOrg,
//   stillWorkingForRespondentJourney,
//   enterRespondentDetailsJourney,
//   enterPersonalDetails,
//   stepsToMakingYourClaim,
//   claimDetails,
// } = require('../../helpers/caseHelper');
// const commonFlow = require('../../helpers/commonFlow.js');

// Feature('End to end journey for submitting a case');

// Scenario('Submit a single claim for myself', async ({ I }) => {
//   await commonFlow.createSingleMyselfCase();
//   await I.authenticateWithIdam();
//   await doNotHaveToCompleteCard(I);
//   await stepsToMakingYourClaim(I);
//   await enterPersonalDetails(I);
//   await didYouWorkForOrganisation(I, 'Yes');
//   await areYouStillWorkingForOrg(I, 'Still working for respondent');
//   await stillWorkingForRespondentJourney(I, 'Yes written contract with notice period', 'Months');
//   await enterRespondentDetailsJourney(I, 'No', 'Yes');
//   I.click("//a[contains(.,'Describe what happened to you')]");
//   await claimDetails(I);
// }).tag('@RET-BAT');
