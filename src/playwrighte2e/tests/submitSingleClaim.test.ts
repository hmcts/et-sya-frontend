import { test } from '../fixtures/common.fixture';

test.describe('Submit a single claim for myself without the Complete PCQ/Equality', () => {
   
    test('should submit a single claim', {tag: ['@RET-BAT', '@RET-PR']}, async ({ page, claimStartPage, loginPage, saveCardPage,
         makeClaimPage, personalDetailsPage, employmentDetailsPage, claimDetailsPage, submitPage}) => {
        await claimStartPage.createSingleMyselfCase();
        await loginPage.signIn();
        await saveCardPage.doNotHaveToCompleteCard();
        await makeClaimPage.stepsToMakingYourClaim(false);
        await personalDetailsPage.enterPersonalDetails();
        await employmentDetailsPage.didYouWorkForOrg('Yes');
        await employmentDetailsPage.areYouStillWorkingForOrg('Still working for respondent');
        await employmentDetailsPage.stillWorkingForRespondentJourney('Yes written contract with notice period', 'Months');
        await employmentDetailsPage.enterRespondantDetailsJourney('No', 'No');
        await page.click("//a[contains(.,'Describe what happened to you')]");
        await claimDetailsPage.claimDet();
        await makeClaimPage.stepsToMakingYourClaim(true);
        await submitPage.submitClaim(false);
        await submitPage.checkYourAnswers();
        await submitPage.claimSubmitted();
    });
});
