import { test } from '../fixtures/et.sya.test.fixture';
import { createCaseViaCitizenUI, resolveResourceJson, users, config } from '@hmcts/et-shared-test-library';

let userDetailsData: any;

test.describe('Submit a single claim for myself without the Complete PCQ/Equality', () => {
  test.beforeAll(async () => {
    userDetailsData = resolveResourceJson('resources/payload/user-details.json');
  });

  test(
    'Create a claim for still working for organisation, submit and process within manage cases',
    {
      tag: ['@RET-BAT', '@RET-PR', '@cx', '@smoke', '@ccd-callback-tests'],
    },
    async ({
      page,
      loginPage,
      citizenPreLoginPage,
      citizenPostLoginPage,
      personalDetailsPage,
      employmentAndRespondentDetailsPage,
      claimDetailsPage,
      submitClaimPage,
      singleOrMultipleClaimPage,
    }) => {
      await createCaseViaCitizenUI(
        page,
        citizenPreLoginPage,
        citizenPostLoginPage,
        personalDetailsPage,
        employmentAndRespondentDetailsPage,
        claimDetailsPage,
        submitClaimPage,
        singleOrMultipleClaimPage,
        'EnglandWales',
        'Claiming for myself',
        false,
        async () => {
          await loginPage.processLogin(users.etClaimant, config.etSyaUiUrl);
        },
        employmentAndRespondentDetailsPage =>
          employmentAndRespondentDetailsPage.processStillWorkingJourney(
            userDetailsData.workPostcode,
            userDetailsData.selectedWorkAddress,
            userDetailsData.firstLineOfAddress
          )
      );
    }
  );
});
