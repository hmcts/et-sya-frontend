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
const summaryListClass = 'govuk-summary-list__value';
const summaryListHeadingClass = 'govuk-summary-list__key';

const reqUrl = '/respondent-application-details/1';

const expectedRowHeader1 = respondentApplicationDetailsJSON.applicant;
const expectedRowHeader2 = respondentApplicationDetailsJSON.requestDate;
const expectedRowHeader3 = respondentApplicationDetailsJSON.applicationType;
const expectedRowHeader4 = respondentApplicationDetailsJSON.legend;
const expectedRowHeader5 = respondentApplicationDetailsJSON.supportingMaterial;
const expectedRowHeader6 = respondentApplicationDetailsJSON.copyCorrespondence;

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
                status: 'notStartedYet',
                number: '1',
                applicant: 'Respondent',
                details: 'Test text',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
              },
            },
            {
              id: 'abc1234',
              value: {
                date: '8 March 2023',
                type: 'Restrict publicity',
                status: 'notStartedYet',
                number: '2',
                applicant: 'Respondent',
                details: 'Testing',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
              },
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
    const rowHeader = htmlRes.getElementsByClassName(summaryListHeadingClass);
    expect(rowHeader[0].innerHTML).contains(expectedRowHeader1, 'Header does not exist');
    expect(rowHeader[1].innerHTML).contains(expectedRowHeader2, 'Header does not exist');
    expect(rowHeader[2].innerHTML).contains(expectedRowHeader3, 'Header does not exist');
    expect(rowHeader[3].innerHTML).contains(expectedRowHeader4, 'Header does not exist');
    expect(rowHeader[4].innerHTML).contains(expectedRowHeader5, 'Header does not exist');
    expect(rowHeader[5].innerHTML).contains(expectedRowHeader6, 'Header does not exist');
  });

  it('should display respondent application details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListClass);
    expect(summaryListData[0].innerHTML).contains('Respondent', 'Application date does not exist');
    expect(summaryListData[1].innerHTML).contains('7 March 2023', ' Application type does not exist');
    //expect(summaryListData[2].innerHTML).contains('Amend response', ' Application type does not exist');
    expect(summaryListData[3].innerHTML).contains('Test text', ' Application type does not exist');
    expect(summaryListData[4].innerHTML).contains('', ' Application type does not exist');
    expect(summaryListData[5].innerHTML).contains(YesOrNo.YES, ' Application type does not exist');
  });
});
