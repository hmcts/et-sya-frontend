const testConfig = require('../../config');
Feature('End To End Tests For an ET Case Submitted in the sya Front end in the Welsh Language Format.');
Scenario(
  'Make Draft Application : Functional Tests',
  async ({
    I,
    preLoginScreensWelsh,
    loginPage,
    taskListPageWelsh,
    personalDetailsPageWelsh,
    employmentAndRespondentPageWelsh,
    claimDetailsPageWelsh,
    submitClaimPageWelsh,
  }) => {
    preLoginScreensWelsh.processPreLoginPagesForTheDraftApplication();
    loginPage.processLogin(testConfig.TestEnvETUser, testConfig.TestEnvETPassword);
    taskListPageWelsh.processPostLoginPagesForTheDraftApplication();
    personalDetailsPageWelsh.processPersonalDetails();
    employmentAndRespondentPageWelsh.processStillWorkingJourney();
    claimDetailsPageWelsh.processClaimDetails();
    const submissionReference = await submitClaimPageWelsh.submitClaim();
    console.log(submissionReference);
    I.click('Allgofnodi');
  }
).tag('@RET-WIP-WELSH');
