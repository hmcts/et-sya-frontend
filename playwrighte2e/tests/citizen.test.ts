import {
  CaseTypeLocation,
  CitizenClaimantFactory,
  CitizenHubLoginPage,
  cuiApi,
  Et1ClaimsListPage,
  users,
} from '@hmcts/et-shared-test-library';
import { test } from '../fixtures/et.sya.test.fixture';

test.describe.serial('Claimant navigate back to Case list', () => {
  let caseNumber: string;
  let caseId: string;

  test.use({
    storageState: users.etClaimant.sessionFile,
  });

  test(
    'Claimant can navigate to Case list and Citizen varifies legal representative details',
    {
      tag: ['@accessibility'],
    },
    async ({ citizenHubPage, citizenHubLoginPage, et1ClaimsListPage }) => {
      caseId = await CitizenClaimantFactory.createAndUpdateClaim(CaseTypeLocation.EnglandAndWales);
      await citizenHubLoginPage.processCitizenHubLogin(users.etClaimant);
      await et1ClaimsListPage.continueToCaseFromDraftClaimsTable(caseId);
      await et1ClaimsListPage.clickMyEt1ClaimLink();
      await et1ClaimsListPage.assertCaseListedInDraftClaims(caseId);

      await cuiApi.submitDraftCuiCase(
        users.etClaimant.email,
        users.etClaimant.password,
        caseId,
        CaseTypeLocation.EnglandAndWales
      );

      await citizenHubLoginPage.processCitizenHubLogin(users.etClaimant);
      await et1ClaimsListPage.navigateToCaseFromSubmittedClaimsTable(caseId);
      await et1ClaimsListPage.clickMyEt1ClaimLink();
      caseNumber = await et1ClaimsListPage.navigateToCaseFromSubmittedClaimsTable(caseId);
      await citizenHubPage.citizenHubCaseOverviewPage(caseNumber);

      //claimant verify legal rep's details
      await citizenHubPage.appointLegalRep(caseNumber, caseId);
    }
  );

  test('Offline cases & online cases Assigning in SYA', async ({
    citizenHubLoginPage,
    et1ClaimsListPage,
    browserUtils,
  }) => {
    await citizenHubLoginPage.processCitizenHubLogin(users.etClaimant);
    await et1ClaimsListPage.navigateToAddAnExistingClaimLink();
    await et1ClaimsListPage.enterCaseNumberText('6073847/2024'); // random case number not available online
    await et1ClaimsListPage.clickContinue();
    await et1ClaimsListPage.assertErrorMessage([
      'This case is not available online. Contact the tribunal if you want to know more about this case.',
    ]);

    caseId = await CitizenClaimantFactory.createAndSubmitClaim(
      CaseTypeLocation.EnglandAndWales,
      false,
      users.etClaimant2
    );
    const claimant2Browser = await browserUtils.openNewBrowserContext(users.etClaimant2.sessionFile);
    const claimant2CitizenHubLoginPage = new CitizenHubLoginPage(claimant2Browser);
    const claimant2Et1ClaimsListPage = new Et1ClaimsListPage(claimant2Browser);
    await claimant2CitizenHubLoginPage.processCitizenHubLogin(users.etClaimant2);
    caseNumber = await claimant2Et1ClaimsListPage.navigateToCaseFromSubmittedClaimsTable(caseId);

    await et1ClaimsListPage.enterCaseNumberText(caseNumber);
    await et1ClaimsListPage.clickContinue();
    await et1ClaimsListPage.enterYourCaseDetails(caseId.toString(), 'Grayson Becker');
    await et1ClaimsListPage.clickContinue();
    await et1ClaimsListPage.confirmAndSubmitCaseDetails(false);
    await et1ClaimsListPage.assertErrorMessage([
      'You cannot access this case because the details you have entered are linked to another claimant. Contact the Employment Tribunal if you think this is wrong.',
    ]);
    await et1ClaimsListPage.clickMyEt1ClaimLink();
    await et1ClaimsListPage.assertCaseIdNotListedInET1ClaimsPage(caseId.toString());
  });
});
