import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const PAGE_URL = '/check-your-answers';
const expectedTitle = 'Check your answers';
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const summeryListClass = 'govuk-summary-list';
const summeryListHeadingClass = 'govuk-summary-list__key govuk-heading-m';
const summeryListKeyExcludeHeadingClass = '.govuk-summary-list__key:not(.govuk-heading-m)';
const summeryListLinkClass = 'govuk-link';
const submitYourClaimClass = 'govuk-heading-m govuk-!-margin-bottom-2 govuk-!-margin-top-9';
const expectedSubmitYourClaim = 'Submit your claim';
const submitYourClaimBodyClass = 'govuk-body';
const expectedSubmitYourClaimText1 = 'Check all the answers you’ve provided and details you have entered are correct.';
const expectedSubmitYourClaimText2 = 'Remember, if you’re not sure about anything, you can save and return to your claim at any time by selecting ‘Save for later’ at the bottom of this page.';
const expectedSubmitYourClaimText3 = 'We’ll send you an email confirmation once you’ve submitted your claim.';
const warningClass = 'govuk-warning-text';
const expectedWarningText = 'This is your last opportunity to change any details before you submit your claim.';

let htmlRes: Document;
describe('Check your answers confirmation page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display submit claim button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Submit claim', 'Could not find the submit claim button');
  });

  it('should display save for later button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save for later', 'Could not find the button');
  });

  it('should display 8 summery lists', () => {
    const summeryLists = htmlRes.getElementsByClassName(summeryListClass);
    expect(summeryLists.length).equal(8, '8 summery lists not found');
  });

  it('should display correct headings in the summery lists', () => {
    const summeryLists = htmlRes.getElementsByClassName(summeryListHeadingClass);
    expect(summeryLists[0].innerHTML).contains('Type of claim', 'List heading not found');
    expect(summeryLists[1].innerHTML).contains('Personal details', 'List heading not found');
    expect(summeryLists[2].innerHTML).contains('Contact details', 'List heading not found');
    expect(summeryLists[3].innerHTML).contains('Your preferences', 'List heading not found');
    expect(summeryLists[4].innerHTML).contains('Employer', 'List heading not found');
    expect(summeryLists[5].innerHTML).contains('Employment details', 'List heading not found');
    expect(summeryLists[6].innerHTML).contains('Respondent details', 'List heading not found');
    expect(summeryLists[7].innerHTML).contains('Claim details', 'List heading not found');
  });

  it('should display 1 row in Type Of Claim summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const typeOfClaimList = summeryListSections[0].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(typeOfClaimList.length).equals(1, 'Incorrect number of rows found');
  });

  it('should display 4 rows in Personal Details summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const personalDetailsList = summeryListSections[1].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(personalDetailsList.length).equals(4, 'Incorrect number of rows found');
  });

  it('should display 2 rows in Contact Details summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const contactDetailsList = summeryListSections[2].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(contactDetailsList.length).equals(2, 'Incorrect number of rows found');
  });

  it('should display 3 rows in Your Preferences summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const yourPreferencesList = summeryListSections[3].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(yourPreferencesList.length).equals(3, 'Incorrect number of rows found');
  });
  
  it('should display 2 rows in Past Employer summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const employerList = summeryListSections[4].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(employerList.length).equals(2, 'Incorrect number of rows found');
  });

  it('should display 8 rows in Employment Details summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const employmentDetailsList = summeryListSections[5].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(employmentDetailsList.length).equals(8, 'Incorrect number of rows found');
  });

  it('should display 7 rows in Respondent Details summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const respondentDetailsList = summeryListSections[6].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(respondentDetailsList.length).equals(7, 'Incorrect number of rows found');
  });

  it('should display 3 rows in Claim Details summery list', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);
    const claimDetailsList = summeryListSections[7].querySelectorAll(summeryListKeyExcludeHeadingClass);
    expect(claimDetailsList.length).equals(3, 'Incorrect number of rows found');
  });

  it('should have correct urls in the change buttons', () => {
    const summeryListSections = htmlRes.getElementsByClassName(summeryListClass);

    const typeOfClaimList = summeryListSections[0].getElementsByClassName(summeryListLinkClass);
    const typeOfClaimLink = typeOfClaimList[0].getAttribute('href');
    expect(typeOfClaimLink).equals(PageUrls.TYPE_OF_CLAIM, 'Incorrect href found');

    const personalDetailsList = summeryListSections[1].getElementsByClassName(summeryListLinkClass);
    const dateOfBirthLink = personalDetailsList[0].getAttribute('href');
    const genderLink = personalDetailsList[1].getAttribute('href');
    const genderSameAsBirthLink = personalDetailsList[2].getAttribute('href');
    const titleLink = personalDetailsList[3].getAttribute('href');
    expect(dateOfBirthLink).equals(PageUrls.DOB_DETAILS, 'Incorrect href found');
    expect(genderLink).equals(PageUrls.GENDER_DETAILS, 'Incorrect href found');
    expect(genderSameAsBirthLink).equals(PageUrls.GENDER_DETAILS, 'Incorrect href found');
    expect(titleLink).equals(PageUrls.GENDER_DETAILS, 'Incorrect href found');

    const contactDetailsList = summeryListSections[2].getElementsByClassName(summeryListLinkClass);
    const contactLink = contactDetailsList[0].getAttribute('href');
    const telephoneLink = contactDetailsList[1].getAttribute('href');
    expect(contactLink).equals(PageUrls.ADDRESS_DETAILS, 'Incorrect href found');
    expect(telephoneLink).equals(PageUrls.TELEPHONE_NUMBER, 'Incorrect href found');

    const yourPreferencesList = summeryListSections[3].getElementsByClassName(summeryListLinkClass);
    // To-do const requireAsistenceLink = yourPreferencesList[0].getAttribute('href');
    const updatePreferenceLink = yourPreferencesList[1].getAttribute('href');
    const videoHearingsLink = yourPreferencesList[2].getAttribute('href');
    expect(updatePreferenceLink).equals(PageUrls.UPDATE_PREFERENCES, 'Incorrect href found');
    expect(videoHearingsLink).equals(PageUrls.VIDEO_HEARINGS, 'Incorrect href found');

    const employerList = summeryListSections[4].getElementsByClassName(summeryListLinkClass);
    const didYouWorkForLink = employerList[0].getAttribute('href');
    const isStillWorkingLink = employerList[1].getAttribute('href');
    expect(didYouWorkForLink).equals(PageUrls.PAST_EMPLOYER, 'Incorrect href found');
    expect(isStillWorkingLink).equals(PageUrls.PRESENT_EMPLOYER, 'Incorrect href found');

    const employmentDetailsList = summeryListSections[5].getElementsByClassName(summeryListLinkClass);
    const jobTitleLink = employmentDetailsList[0].getAttribute('href');
    const startDateLink = employmentDetailsList[1].getAttribute('href');
    const noticePeriodLink = employmentDetailsList[2].getAttribute('href');
    const weeklyHoursLink = employmentDetailsList[3].getAttribute('href');
    const payBeforeTaxLink = employmentDetailsList[4].getAttribute('href');
    const payAfterTaxLink = employmentDetailsList[5].getAttribute('href');
    const pensionSchemeLink = employmentDetailsList[6].getAttribute('href');
    const benefitsLink = employmentDetailsList[7].getAttribute('href');
    expect(jobTitleLink).equals(PageUrls.JOB_TITLE, 'Incorrect href found');
    expect(startDateLink).equals(PageUrls.START_DATE, 'Incorrect href found');
    expect(noticePeriodLink).equals(PageUrls.NOTICE_END, 'Incorrect href found');
    expect(weeklyHoursLink).equals(PageUrls.AVERAGE_WEEKLY_HOURS, 'Incorrect href found');
    expect(payBeforeTaxLink).equals(PageUrls.PAY_BEFORE_TAX, 'Incorrect href found');
    expect(payAfterTaxLink).equals(PageUrls.PAY_AFTER_TAX, 'Incorrect href found');
    expect(pensionSchemeLink).equals(PageUrls.PENSION, 'Incorrect href found');
    expect(benefitsLink).equals(PageUrls.BENEFITS, 'Incorrect href found');

    const respondentDetailsList = summeryListSections[6].getElementsByClassName(summeryListLinkClass);
    // to-do const orgOrPersonLink = respondentDetailsList[0].getAttribute('href');
    // to-do const acasNumberLink = respondentDetailsList[1].getAttribute('href');
    const acasExemptionLink = respondentDetailsList[2].getAttribute('href');
    // to-do const nameLink = respondentDetailsList[3].getAttribute('href');
    // to-do const respondenttelephoneLink = respondentDetailsList[4].getAttribute('href');
    // to-do const officeAddressLink = respondentDetailsList[5].getAttribute('href');
    // to-do const workAddressLink = respondentDetailsList[6].getAttribute('href');
    expect(acasExemptionLink).equals(PageUrls.NO_ACAS_NUMBER, 'Incorrect href found');

    const claimDetailsList = summeryListSections[7].getElementsByClassName(summeryListLinkClass);
    const summaryLink = claimDetailsList[0].getAttribute('href');
    const fileUploadsLink = claimDetailsList[1].getAttribute('href');
    const whatYouWantLink = claimDetailsList[2].getAttribute('href');
    expect(summaryLink).equals(PageUrls.CLAIM_STEPS, 'Incorrect href found');
    expect(fileUploadsLink).equals(PageUrls.SUMMARISE_YOUR_CLAIM, 'Incorrect href found');
    expect(whatYouWantLink).equals(PageUrls.DESIRED_CLAIM_OUTCOME, 'Incorrect href found');
  });

  it('should display Submit Your Claim heading', () => {
    const heading = htmlRes.getElementsByClassName(submitYourClaimClass);
    expect(heading[0].innerHTML).contains(expectedSubmitYourClaim, 'Submit Your Claim heading does not exist');
  });

  it('should display Submit Your Claim texts', () => {
    const title = htmlRes.getElementsByClassName(submitYourClaimBodyClass);
    expect(title[1].innerHTML).contains(expectedSubmitYourClaimText1, 'Submit Your Claim text does not exist');
    expect(title[2].innerHTML).contains(expectedSubmitYourClaimText2, 'Submit Your Claim text does not exist');
    expect(title[3].innerHTML).contains(expectedSubmitYourClaimText3, 'Submit Your Claim text does not exist');
  });

  it('should display warning message', () => {
    const warning = htmlRes.getElementsByClassName(warningClass);
    expect(warning[0].innerHTML).contains(expectedWarningText, 'Warning text does not exist');

  });

});
