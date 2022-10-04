const { stepsToMakingYourClaim, claimDetails } = require('../../helpers/caseHelper');
const authPage = require('../WIP/authPage');
const testUrl = '/steps-to-making-your-claim';
const { I } = inject();

Feature('Enter claim details for a claim');

Scenario('Navigate Claim Details - Describe What happenned to you', async () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Describe what happened to you')]");
  await claimDetails(I);
}).tag('@RET-XB');

Scenario('Navigate Claim Details - Tell us what you want from your claim', async () => {
  I.amOnPage(testUrl);
  authPage.login();
  I.amOnPage(testUrl);
  await stepsToMakingYourClaim(I);
  I.click("//a[contains(.,'Tell us what you want from your claim')]");
  await claimDetails(I, false);
}).tag('@RET-WIP');
