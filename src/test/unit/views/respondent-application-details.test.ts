import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { mockApp } from '../mocks/mockApp';

const respondentApplicationDetailsJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-application-details.json'),
  'utf-8'
);

const respondentApplicationDetailsJSON = JSON.parse(respondentApplicationDetailsJSONRaw);
const titleClass = 'govuk-heading-xl govuk-!-margin-bottom-4 govuk-!-margin-top-1';
const summaryListValueClass = 'govuk-summary-list__value';
const summaryListKeyClass = 'govuk-summary-list__key';
const summaryListTitleClass = 'govuk-summary-list__key govuk-heading-m govuk-!-margin-top-1';
//const buttonClass = 'govuk-button';

const reqUrl = '/respondent-application-details/abc123';

const expectedRowHeader1 = respondentApplicationDetailsJSON.applicant;
const expectedRowHeader2 = respondentApplicationDetailsJSON.requestDate;
const expectedRowHeader3 = respondentApplicationDetailsJSON.applicationType;
const expectedRowHeader4 = respondentApplicationDetailsJSON.legend;
const expectedRowHeader5 = respondentApplicationDetailsJSON.supportingMaterial;
const expectedRowHeader6 = respondentApplicationDetailsJSON.copyCorrespondence;
const expectedRowHeader7 = respondentApplicationDetailsJSON.responseFrom;
const expectedRowHeader8 = respondentApplicationDetailsJSON.responseDate;
const expectedRowHeader9 = respondentApplicationDetailsJSON.response;
const expectedRowHeader10 = respondentApplicationDetailsJSON.supportingMaterial;
const expectedRowHeader11 = respondentApplicationDetailsJSON.copyCorrespondence;
const expectedResponseSummaryListHeader = respondentApplicationDetailsJSON.otherPartyResponseHeader;

let htmlRes: Document;

describe('Respondent Application details page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: 'abc123',
              value: {
                date: '7 March 2023',
                type: 'Amend response',
                status: 'inProgress',
                number: '1',
                applicant: 'Respondent',
                details: 'Test text',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
                applicationState: 'inProgress',
                respondCollection: [
                  {
                    id: '1',
                    value: {
                      from: 'Claimant',
                      date: '20 March 2023',
                      response: 'Response text',
                      copyToOtherParty: YesOrNo.YES,
                    },
                  },
                ],
              },
              linkValue: 'amend response',
            },
          ],
        },
      })
    )
      .get(reqUrl)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(respondentApplicationDetailsJSON.applicationTo + 'amend response');
  });

  it('should display respondent application row headers', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[0].innerHTML).contains(expectedRowHeader1, 'Header does not exist');
    expect(rowHeader[1].innerHTML).contains(expectedRowHeader2, 'Header does not exist');
    expect(rowHeader[2].innerHTML).contains(expectedRowHeader3, 'Header does not exist');
    expect(rowHeader[3].innerHTML).contains(expectedRowHeader4, 'Header does not exist');
    expect(rowHeader[4].innerHTML).contains(expectedRowHeader5, 'Header does not exist');
    expect(rowHeader[5].innerHTML).contains(expectedRowHeader6, 'Header does not exist');
  });

  it('should display respondent application details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[0].innerHTML).contains('Respondent', 'Applicant does not exist');
    expect(summaryListData[1].innerHTML).contains('7 March 2023', 'Application type does not exist');
    expect(summaryListData[2].innerHTML).contains('amend response', 'Application date does not exist');
    expect(summaryListData[3].innerHTML).contains('Test text', 'Application detail does not exist');
    expect(summaryListData[4].innerHTML).contains('', 'Supporting material does not exist');
    expect(summaryListData[5].innerHTML).contains(YesOrNo.YES, 'Rule 92 answer does not exist');
  });

  it('should display claimant response header', () => {
    const title = htmlRes.getElementsByClassName(summaryListTitleClass);
    expect(title[0].innerHTML).contains(expectedResponseSummaryListHeader);
  });

  it('should display claimant response row headers', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[7].innerHTML).contains(expectedRowHeader7, 'Header does not exist');
    expect(rowHeader[8].innerHTML).contains(expectedRowHeader8, 'Header does not exist');
    expect(rowHeader[9].innerHTML).contains(expectedRowHeader9, 'Header does not exist');
    expect(rowHeader[10].innerHTML).contains(expectedRowHeader10, 'Header does not exist');
    expect(rowHeader[11].innerHTML).contains(expectedRowHeader11, 'Header does not exist');
  });

  it('should display claimant response details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[6].innerHTML).contains('Claimant', 'Applicant does not exist');
    expect(summaryListData[7].innerHTML).contains('20 March 2023', 'Application date does not exist');
    expect(summaryListData[8].innerHTML).contains('Response text', 'Application detail does not exist');
    expect(summaryListData[9].innerHTML).contains('', 'Supporting material does not exist');
    expect(summaryListData[10].innerHTML).contains(YesOrNo.YES, 'Rule 92 answer does not exist');
  });
});
