const {
  stillWorkingForRespondentJourney,
  areYouStillWorkingForOrg,
  workingNoticePeriodForRespondentJourney,
  noLongerWorkingForRespondentJourney,
} = require('../../helpers/caseHelper');
const authPage = require('../WIP/authPage.js');
const testUrl = '/are-you-still-working';

Feature('Enter employment and respondent details');

Scenario("I'm still working for the respondent and working my notice period in Weeks", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'Still working for respondent');
  await stillWorkingForRespondentJourney(I, 'Yes written contract with notice period', 'Weeks');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm still working for the respondent and working my notice period in Months", async ({ I }) => {
  await I.amOnPage(testUrl);
  await authPage.login();
  await I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'Still working for respondent');
  await stillWorkingForRespondentJourney(I, 'Yes written contract with notice period', 'Months');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm still working for the respondent but no notice period within my contract", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'Still working for respondent');
  await stillWorkingForRespondentJourney(I, 'No written contract with notice period');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm working a notice period for the respondent in Weeks", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'Working Notice Period for respondent');
  await workingNoticePeriodForRespondentJourney(I, 'Weeks');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm working a notice period for the respondent in Months", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'Working Notice Period for respondent');
  await workingNoticePeriodForRespondentJourney(I, 'Months');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm no longer working for respondent- no notice period", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'No Longer working for respondent');
  await noLongerWorkingForRespondentJourney(I, 'No', 'No');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm no longer working for respondent- notice period in Weeks", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'No Longer working for respondent');
  await noLongerWorkingForRespondentJourney(I, 'Yes', 'No', 'Weeks');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm no longer working for respondent- notice period in Months", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'No Longer working for respondent');
  await noLongerWorkingForRespondentJourney(I, 'Yes', 'No', 'Months');
  authPage.logout();
}).tag('@RET-WIP');

Scenario("I'm no longer working notice period and got a new job ", async ({ I }) => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await areYouStillWorkingForOrg(I, 'No Longer working for respondent');
  await noLongerWorkingForRespondentJourney(I, 'Yes', 'Yes', 'Months');
  authPage.logout();
}).tag('@RET-WIP');
