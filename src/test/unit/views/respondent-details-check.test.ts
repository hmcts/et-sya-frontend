import { expect } from 'chai';
import request from 'supertest';

import { NoAcasNumberReason, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { ClaimTypeDiscrimination, TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const expectedTitle = 'Check the respondent details';

let htmlRes: Document;
describe('Respondent Details check page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.RESPONDENT_DETAILS_CHECK)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display Add new respondent button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Add another respondent', 'Could not find the button');
  });
});

describe('Respondent Details Card Action Item Link', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.WHISTLE_BLOWING],
          claimantWorkAddressQuestion: YesOrNo.NO,
          pastEmployer: YesOrNo.YES,
          noticePeriod: YesOrNo.YES,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Does',
              respondentAddress1: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
              acasCert: YesOrNo.YES,
              acasCertNum: 'R123456/12/12',
            },
            {
              respondentNumber: 2,
              respondentName: 'Test Two',
              respondentAddress1: '10 Test Street, Test, AB1 2CD',
              acasCert: YesOrNo.NO,
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
          claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
      .get(PageUrls.RESPONDENT_DETAILS_CHECK)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display two respondents card', () => {
    const summaryCardDiv = htmlRes.getElementsByClassName('govuk-summary-list');
    expect(summaryCardDiv.length).equal(2);
  });

  it('should only display Remove respondent link for second one', () => {
    const summaryCardActionLink = htmlRes.getElementsByClassName('govuk-summary-card__actions');
    expect(summaryCardActionLink.length).equal(1);
  });
});
