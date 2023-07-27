import { expect } from 'chai';
import request from 'supertest';

import { NoAcasNumberReason, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, RespondentType } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const expectedTitle = 'Check the respondent details';
const summaryListClass = 'govuk-summary-list';
const summaryListKeyClass = 'govuk-summary-list__key';
const summaryListValueClass = 'govuk-summary-list__value';
const summaryListActionsClass = 'govuk-summary-list__actions';

let htmlRes: Document;
describe('Respondent Details check page', () => {
  const respondentOrganisation = {
    respondentNumber: 1,
    respondentType: RespondentType.ORGANISATION,
    respondentOrganisation: 'Vandelay Industries',
    respondentAddress1: '123 Main Street',
    respondentAddressPostcode: 'ABC123',
    acasCert: YesOrNo.YES,
    acasCertNum: 'R123456/12/34',
  };

  const respondentIndividual = {
    respondentNumber: 2,
    respondentType: RespondentType.INDIVIDUAL,
    respondentFirstName: 'George',
    respondentLastName: 'Costanza',
    respondentAddress1: '123 High Street',
    respondentAddressPostcode: 'CDE456',
    acasCert: YesOrNo.NO,
    noAcasReason: NoAcasNumberReason.EMPLOYER,
  };

  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondents: [respondentOrganisation, respondentIndividual],
        },
      })
    )
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

  it('should display 2 summary lists, one for each respondent', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListClass);
    expect(summaryLists.length).equal(2, '2 summary lists not found');
  });

  it('should display correct headings in the summary list for the first respondent', () => {
    const summaryListKeys = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(summaryListKeys[0].innerHTML).contains('Respondent type', 'Respondent type heading not found');
    expect(summaryListKeys[1].innerHTML).contains('Organisation name', 'Respondent organisation heading not found');
    expect(summaryListKeys[2].innerHTML).contains('Address', 'Respondent address heading not found');
    expect(summaryListKeys[3].innerHTML).contains(
      'Acas certificate number',
      'Respondent acas cert num heading not found'
    );
  });

  it('should display correct details for the first respondent', () => {
    const summaryListValues = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListValues[0].innerHTML).contains('Organisation', 'Respondent type not found');
    expect(summaryListValues[1].innerHTML).contains('Vandelay Industries', 'Respondent organisation not found');
    expect(summaryListValues[2].innerHTML).contains('123 Main Street, ABC123', 'Respondent address not found');
    expect(summaryListValues[3].innerHTML).contains('R123456/12/34', 'Respondent acas number not found');
  });

  it('should display correct change details links for the first respondent', () => {
    const summaryListActions = htmlRes.getElementsByClassName(summaryListActionsClass);
    expect(summaryListActions[0].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/1/respondent-name/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[1].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/1/respondent-name/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[2].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/1/respondent-address/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[3].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/1/acas-cert-num/change?redirect=respondent">',
      'Change link not found'
    );
  });

  it('should display correct headings in the summary lists for the second respondent', () => {
    const summaryListKeys = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(summaryListKeys[4].innerHTML).contains('Respondent type', 'Respondent type heading not found');
    expect(summaryListKeys[5].innerHTML).contains('First name', 'Respondent first name heading not found');
    expect(summaryListKeys[6].innerHTML).contains('Last name', 'Respondent last name heading not found');
    expect(summaryListKeys[7].innerHTML).contains('Address', 'Respondent address heading not found');
    expect(summaryListKeys[8].innerHTML).contains(
      'Acas certificate number',
      'Respondent no acas heading heading not found'
    );
    expect(summaryListKeys[9].innerHTML).contains(
      'Why do you not have an Acas Number?',
      'Respondent no acas reason heading not found'
    );
  });

  it('should display correct details for the second respondent', () => {
    const summaryListValues = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListValues[4].innerHTML).contains('Individual', 'Respondent type not found');
    expect(summaryListValues[5].innerHTML).contains('George', 'Respondent first name not found');
    expect(summaryListValues[6].innerHTML).contains('Costanza', 'Respondent last name not found');
    expect(summaryListValues[7].innerHTML).contains('123 High Street, CDE456', 'Respondent address not found');
    expect(summaryListValues[8].innerHTML).contains('Not provided', 'Respondent no acas not found');
    expect(summaryListValues[9].innerHTML).contains(
      'My employer has already been in touch with Acas',
      'Respondent no acas reason not found'
    );
  });

  it('should display correct change details links for the second respondent', () => {
    const summaryListActions = htmlRes.getElementsByClassName(summaryListActionsClass);
    expect(summaryListActions[4].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/2/respondent-name/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[5].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/2/respondent-name/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[6].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/2/respondent-name/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[7].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/2/respondent-address/change?redirect=respondent">',
      'Change link not found'
    );
    expect(summaryListActions[8].innerHTML).contains(
      '<a class="govuk-link" href="/respondent/2/acas-cert-num/change?redirect=respondent">',
      'Change link not found'
    );
  });
});
