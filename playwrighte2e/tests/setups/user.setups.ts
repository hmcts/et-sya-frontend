import { test } from '../../fixtures/et.sya.test.fixture';
import { CookieUtils, users } from '@hmcts/et-shared-test-library';

test.describe('set up user context', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // start unauthenticated every setup test
  const cookieName = 'session-freshness-check';
  test('Set up Citizen Claimant user context', async ({ citizenHubLoginPage }) => {
    const user = users.etClaimant;
    if (CookieUtils.isSessionValid(user.sessionFile, cookieName, user.email || undefined)) {
      console.log(`Valid session already exists for ${user.email}, skipping login.`);
      return;
    }
    await citizenHubLoginPage.processCitizenHubLogin(user);
  });

  test('Set up Citizen Claimant2 user context', async ({ citizenHubLoginPage }) => {
    const user = users.etClaimant2;
    if (CookieUtils.isSessionValid(user.sessionFile, cookieName, user.email || undefined)) {
      console.log(`Valid session already exists for ${user.email}, skipping login.`);
      return;
    }
    await citizenHubLoginPage.processCitizenHubLogin(user);
  });
});
