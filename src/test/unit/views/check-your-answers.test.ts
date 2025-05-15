import { expect } from 'chai';
import request from 'supertest';

import { CaseTypeId, NoAcasNumberReason, StillWorking, YesOrNo } from '../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../main/definitions/constants';
import { ClaimTypeDiscrimination, TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/check-your-answers';
const expectedTitle = 'Check your answers';
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const summaryListClass = 'govuk-summary-list';
const summaryListHeadingClass = 'govuk-summary-list__key govuk-heading-m';
const summaryListKeyExcludeHeadingClass = '.govuk-summary-list__key:not(.govuk-heading-m)';
const summaryListLinkClass = 'govuk-link';

let htmlRes: Document;

describe('Check your answers confirmation page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          caseTypeId: CaseTypeId.ENGLAND_WALES,
          typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.WHISTLE_BLOWING],
          claimantWorkAddressQuestion: YesOrNo.NO,
          pastEmployer: YesOrNo.YES,
          noticePeriod: YesOrNo.YES,
          isStillWorking: StillWorking.WORKING,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Does',
              respondentAddress1: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
              acasCert: YesOrNo.NO,
              acasCertNum: '12345',
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
          claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
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
    expect(button[5].innerHTML).contains('Submit', 'Could not find the submit claim button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });

  it('should display 5 summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListClass);
    expect(summaryLists.length).equal(5, '5 summary lists not found');
  });

  it('should display correct headings in the summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListHeadingClass);
    expect(summaryLists[0].innerHTML).contains('Application details', 'List heading not found');
    expect(summaryLists[1].innerHTML).contains('Your details', 'List heading not found');
    expect(summaryLists[2].innerHTML).contains('Employment details', 'List heading not found');
    expect(summaryLists[3].innerHTML).contains('Respondent 1 details', 'List heading not found');
    expect(summaryLists[4].innerHTML).contains('Claim details', 'List heading not found');
  });

  it('should display 1 row in Application details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const typeOfClaimList = summaryListSections[0].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(typeOfClaimList.length).equals(1, 'Incorrect number of rows found');
  });

  it('should display 11 rows in Your Details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const personalDetailsList = summaryListSections[1].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(personalDetailsList.length).equals(11, 'Incorrect number of rows found');
  });

  it('should display 13 rows in Employment Details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const employmentDetailsList = summaryListSections[2].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(employmentDetailsList.length).equals(13, 'Incorrect number of rows found');
  });

  it('should display 6 rows in Respondent Details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const respondentDetailsList = summaryListSections[3].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(respondentDetailsList.length).equals(6, 'Incorrect number of rows found');
  });

  it('should display 6 rows in Claim Details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const claimDetailsList = summaryListSections[4].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(claimDetailsList.length).equals(6, 'Incorrect number of rows found');
  });

  it('should display correct url in the change buttons for Application details row', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const typeOfClaimList = summaryListSections[0].getElementsByClassName(summaryListLinkClass);
    const typeOfClaimLink = typeOfClaimList[0].getAttribute('href');
    expect(typeOfClaimLink).equals(PageUrls.TYPE_OF_CLAIM + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
  });

  it('should display correct url in the change buttons for Your details row', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const yourDetailsList = summaryListSections[1].getElementsByClassName(summaryListLinkClass);
    const dobDetailsLink = yourDetailsList[0].getAttribute('href');
    const sexDetailsLink = yourDetailsList[1].getAttribute('href');
    const preferredTitleLink = yourDetailsList[2].getAttribute('href');
    const homeAddressLink = yourDetailsList[3].getAttribute('href');
    const telephoneLink = yourDetailsList[4].getAttribute('href');
    const howToContactLink = yourDetailsList[5].getAttribute('href');
    const contactLanguageLink = yourDetailsList[6].getAttribute('href');
    const contactHearingLink = yourDetailsList[7].getAttribute('href');
    const hearingsLink = yourDetailsList[8].getAttribute('href');
    const hearingPanelLink = yourDetailsList[9].getAttribute('href');
    const disabilityLink = yourDetailsList[10].getAttribute('href');

    expect(dobDetailsLink).equals(PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(sexDetailsLink).equals(PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(preferredTitleLink).equals(PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(homeAddressLink).equals(PageUrls.ADDRESS_DETAILS + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(telephoneLink).equals(PageUrls.TELEPHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(howToContactLink).equals(
      PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(contactLanguageLink).equals(
      PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(contactHearingLink).equals(
      PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(hearingsLink).equals(PageUrls.VIDEO_HEARINGS + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(hearingPanelLink).equals(
      PageUrls.HEARING_PANEL_PREFERENCE + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(disabilityLink).equals(
      PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
  });

  it('should display correct url in the change buttons for respondent details row', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const respondentDetailsList = summaryListSections[3].getElementsByClassName(summaryListLinkClass);
    const respondentNameLink = respondentDetailsList[0].getAttribute('href');
    const respondentAddressLink = respondentDetailsList[1].getAttribute('href');
    const workedForRespondentLink = respondentDetailsList[2].getAttribute('href');
    const addressWorkedAtLink = respondentDetailsList[3].getAttribute('href');
    const haveAcasLink = respondentDetailsList[4].getAttribute('href');
    const whyNoAcasLength = respondentDetailsList[5].getAttribute('href');
    const respondentPartialUrl = '/respondent/1';
    expect(respondentNameLink).equals(
      respondentPartialUrl + PageUrls.RESPONDENT_NAME + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(respondentAddressLink).equals(
      respondentPartialUrl + PageUrls.RESPONDENT_POSTCODE_ENTER + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(workedForRespondentLink).equals(
      respondentPartialUrl + PageUrls.WORK_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(addressWorkedAtLink).equals(
      respondentPartialUrl + PageUrls.PLACE_OF_WORK + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(haveAcasLink).equals(
      respondentPartialUrl + PageUrls.ACAS_CERT_NUM + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(whyNoAcasLength).equals(
      respondentPartialUrl + PageUrls.NO_ACAS_NUMBER + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
  });

  it('should display correct url in the change buttons for employment details row', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const employmentDetailsList = summaryListSections[2].getElementsByClassName(summaryListLinkClass);
    const pastEmployerLink = employmentDetailsList[0].getAttribute('href');
    const stillWorkingLink = employmentDetailsList[1].getAttribute('href');
    const jobTitleLink = employmentDetailsList[2].getAttribute('href');
    const employmentStartDateLink = employmentDetailsList[3].getAttribute('href');
    const contractNoticePeriodLink = employmentDetailsList[4].getAttribute('href');
    const noticePeriodType = employmentDetailsList[5].getAttribute('href');
    const noticePeriodLength = employmentDetailsList[6].getAttribute('href');
    const averageWeeklyHoursLink = employmentDetailsList[7].getAttribute('href');
    const payBeforeTaxLink = employmentDetailsList[8].getAttribute('href');
    const payAfterTaxLink = employmentDetailsList[9].getAttribute('href');
    const payIntervalLink = employmentDetailsList[10].getAttribute('href');
    const pensionLink = employmentDetailsList[11].getAttribute('href');
    const benefitLink = employmentDetailsList[12].getAttribute('href');

    expect(pastEmployerLink).equals(PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(stillWorkingLink).equals(PageUrls.STILL_WORKING + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(jobTitleLink).equals(PageUrls.JOB_TITLE + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(employmentStartDateLink).equals(PageUrls.START_DATE + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(contractNoticePeriodLink).equals(
      PageUrls.NOTICE_PERIOD + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(noticePeriodLength).equals(PageUrls.NOTICE_LENGTH + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(noticePeriodType).equals(PageUrls.NOTICE_TYPE + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(averageWeeklyHoursLink).equals(
      PageUrls.AVERAGE_WEEKLY_HOURS + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(payBeforeTaxLink).equals(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(payAfterTaxLink).equals(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(payIntervalLink).equals(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(pensionLink).equals(PageUrls.PENSION + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(benefitLink).equals(PageUrls.BENEFITS + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
  });

  it('should display correct url in the change buttons for claim details row', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const claimDetailsList = summaryListSections[4].getElementsByClassName(summaryListLinkClass);
    const typeOfDescriminationList = claimDetailsList[0].getAttribute('href');
    const whatHappenedLink = claimDetailsList[1].getAttribute('href');
    const whatYouWantLink = claimDetailsList[2].getAttribute('href');
    const compensationLink = claimDetailsList[3].getAttribute('href');
    const tribunalRecommendationLink = claimDetailsList[4].getAttribute('href');
    const whistleBlowingLink = claimDetailsList[5].getAttribute('href');

    expect(typeOfDescriminationList).equals(
      PageUrls.CLAIM_TYPE_DISCRIMINATION + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(whatHappenedLink).equals(
      PageUrls.DESCRIBE_WHAT_HAPPENED + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(whatYouWantLink).equals(
      PageUrls.TELL_US_WHAT_YOU_WANT + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(compensationLink).equals(PageUrls.COMPENSATION + InterceptPaths.ANSWERS_CHANGE, 'Incorrect href found');
    expect(tribunalRecommendationLink).equals(
      PageUrls.TRIBUNAL_RECOMMENDATION + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
    expect(whistleBlowingLink).equals(
      PageUrls.WHISTLEBLOWING_CLAIMS + InterceptPaths.ANSWERS_CHANGE,
      'Incorrect href found'
    );
  });
});

describe('CYA for Scottish cases', () => {
  beforeAll(async () => {
    await request(mockApp({ userCase: { caseTypeId: CaseTypeId.SCOTLAND } }))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display 9 rows in Your Details summary list', () => {
    const summaryListSections = htmlRes.getElementsByClassName(summaryListClass);
    const personalDetailsList = summaryListSections[1].querySelectorAll(summaryListKeyExcludeHeadingClass);
    expect(personalDetailsList.length).equals(9, 'Incorrect number of rows found');
  });
});

describe('Check your answers confirmation page - New Job with start date', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          caseTypeId: CaseTypeId.ENGLAND_WALES,
          typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.WHISTLE_BLOWING],
          claimantWorkAddressQuestion: YesOrNo.NO,
          pastEmployer: YesOrNo.YES,
          noticePeriod: YesOrNo.YES,
          isStillWorking: StillWorking.NO_LONGER_WORKING,
          newJob: YesOrNo.YES,
          newJobStartDate: { year: '2020', month: '04', day: '21' },
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Does',
              respondentAddress1: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
              acasCert: YesOrNo.NO,
              acasCertNum: '12345',
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
          claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should show new job start date', () => {
    const allKeys = htmlRes.getElementsByClassName('govuk-summary-list__key govuk-!-font-weight-regular-m');
    expect(allKeys[25].innerHTML).contains('Have you got a new job?', 'Yes');
    expect(allKeys[26].innerHTML).contains('New job start date', '21-04-2020');
  });
});

describe('Check your answers confirmation page - New Job with undefined', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          caseTypeId: CaseTypeId.ENGLAND_WALES,
          typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.WHISTLE_BLOWING],
          claimantWorkAddressQuestion: YesOrNo.NO,
          pastEmployer: YesOrNo.YES,
          noticePeriod: YesOrNo.YES,
          isStillWorking: StillWorking.NO_LONGER_WORKING,
          newJob: YesOrNo.YES,
          newJobStartDate: undefined,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Does',
              respondentAddress1: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
              acasCert: YesOrNo.NO,
              acasCertNum: '12345',
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
          claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should show new job start date', () => {
    const allKeys = htmlRes.getElementsByClassName('govuk-summary-list__key govuk-!-font-weight-regular-m');
    expect(allKeys[25].innerHTML).contains('Have you got a new job?', 'Yes');
    expect(allKeys[26].innerHTML).contains('New job start date', '');
  });
});
