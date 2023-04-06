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

const respondentAppRowHeader1 = respondentApplicationDetailsJSON.applicant;
const respondentAppRowHeader2 = respondentApplicationDetailsJSON.requestDate;
const respondentAppRowHeader3 = respondentApplicationDetailsJSON.applicationType;
const respondentAppRowHeader4 = respondentApplicationDetailsJSON.legend;
const respondentAppRowHeader5 = respondentApplicationDetailsJSON.supportingMaterial;
const respondentAppRowHeader6 = respondentApplicationDetailsJSON.copyCorrespondence;

const claimantResponseRowHeader1 = respondentApplicationDetailsJSON.responseFrom;
const claimantResponseRowHeader2 = respondentApplicationDetailsJSON.responseDate;
const claimantResponseRowHeader3 = respondentApplicationDetailsJSON.response;
const claimantResponseRowHeader4 = respondentApplicationDetailsJSON.supportingMaterial;
const claimantResponseRowHeader5 = respondentApplicationDetailsJSON.copyCorrespondence;

const adminDecisionRowHeader1 = respondentApplicationDetailsJSON.decision;
const adminDecisionRowHeader2 = respondentApplicationDetailsJSON.notification;
const adminDecisionRowHeader3 = respondentApplicationDetailsJSON.decision;
const adminDecisionRowHeader4 = respondentApplicationDetailsJSON.date;
const adminDecisionRowHeader5 = respondentApplicationDetailsJSON.sentBy;
const adminDecisionRowHeader6 = respondentApplicationDetailsJSON.decisionType;
const adminDecisionRowHeader7 = respondentApplicationDetailsJSON.additionalInfo;
const adminDecisionRowHeader8 = respondentApplicationDetailsJSON.document;
const adminDecisionRowHeader9 = respondentApplicationDetailsJSON.decisionMadeBy;
const adminDecisionRowHeader10 = respondentApplicationDetailsJSON.name;
const adminDecisionRowHeader11 = '<br><br>Notification';

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
                adminDecision: [
                  {
                    id: '1',
                    value: {
                      date: '3 March 2023',
                      decision: 'Granted',
                      decisionMadeBy: 'Judge',
                      decisionMadeByFullName: 'Mr Judgey',
                      typeOfDecision: 'Judgment',
                      selectPartyNotify: 'Both parties',
                      additionalInformation: 'Additional info 1 test text',
                      enterNotificationTitle: 'Decision title 1 test text',
                    },
                  },
                  {
                    id: '2',
                    value: {
                      date: '4 March 2023',
                      decision: 'Granted',
                      decisionMadeBy: 'Judge',
                      decisionMadeByFullName: 'Mr Decider',
                      typeOfDecision: 'Judgment',
                      selectPartyNotify: 'Both parties',
                      additionalInformation: 'Additional info 2 test text',
                      enterNotificationTitle: 'Decision title 2 test text',
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
    expect(rowHeader[0].innerHTML).contains(respondentAppRowHeader1, 'Header does not exist');
    expect(rowHeader[1].innerHTML).contains(respondentAppRowHeader2, 'Header does not exist');
    expect(rowHeader[2].innerHTML).contains(respondentAppRowHeader3, 'Header does not exist');
    expect(rowHeader[3].innerHTML).contains(respondentAppRowHeader4, 'Header does not exist');
    expect(rowHeader[4].innerHTML).contains(respondentAppRowHeader5, 'Header does not exist');
    expect(rowHeader[5].innerHTML).contains(respondentAppRowHeader6, 'Header does not exist');
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
    expect(rowHeader[7].innerHTML).contains(claimantResponseRowHeader1, 'Header does not exist');
    expect(rowHeader[8].innerHTML).contains(claimantResponseRowHeader2, 'Header does not exist');
    expect(rowHeader[9].innerHTML).contains(claimantResponseRowHeader3, 'Header does not exist');
    expect(rowHeader[10].innerHTML).contains(claimantResponseRowHeader4, 'Header does not exist');
    expect(rowHeader[11].innerHTML).contains(claimantResponseRowHeader5, 'Header does not exist');
  });

  it('should display claimant response details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[6].innerHTML).contains('Claimant', 'Applicant does not exist');
    expect(summaryListData[7].innerHTML).contains('20 March 2023', 'Application date does not exist');
    expect(summaryListData[8].innerHTML).contains('Response text', 'Application detail does not exist');
    expect(summaryListData[9].innerHTML).contains('', 'Supporting material field should be blank');
    expect(summaryListData[10].innerHTML).contains(YesOrNo.YES, 'Rule 92 answer does not exist');
  });

  it('should display admin decision row headers for latest admin decision, with no space at the top of the table', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[12].innerHTML).contains(adminDecisionRowHeader1, 'Header does not exist');
    expect(rowHeader[13].innerHTML).contains(adminDecisionRowHeader2, 'Header does not exist');
    expect(rowHeader[14].innerHTML).contains(adminDecisionRowHeader3, 'Header does not exist');
    expect(rowHeader[15].innerHTML).contains(adminDecisionRowHeader4, 'Header does not exist');
    expect(rowHeader[16].innerHTML).contains(adminDecisionRowHeader5, 'Header does not exist');
    expect(rowHeader[17].innerHTML).contains(adminDecisionRowHeader6, 'Header does not exist');
    expect(rowHeader[18].innerHTML).contains(adminDecisionRowHeader7, 'Header does not exist');
    expect(rowHeader[19].innerHTML).contains(adminDecisionRowHeader8, 'Header does not exist');
    expect(rowHeader[20].innerHTML).contains(adminDecisionRowHeader9, 'Header does not exist');
    expect(rowHeader[21].innerHTML).contains(adminDecisionRowHeader10, 'Header does not exist');
  });

  it('if more than one admin decision, should display in order starting with the most recent', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[11].innerHTML).contains('Decision title 2 test text', 'Decision title does not exist');
    expect(summaryListData[12].innerHTML).contains('Granted', 'Decision does not exist');
    expect(summaryListData[13].innerHTML).contains('4 March 2023', 'Decision date does not exist');
    expect(summaryListData[14].innerHTML).contains('Tribunal', 'Decision maker does not exist');
    expect(summaryListData[15].innerHTML).contains('Judgment', 'Decision type does not exist');
    expect(summaryListData[16].innerHTML).contains(
      'Additional info 2 test text',
      'Decision additional info does not exist'
    );
    expect(summaryListData[17].innerHTML).contains('', 'Supporting material should be blank');
    expect(summaryListData[18].innerHTML).contains('Judge', 'Decision made by does not exist');
    expect(summaryListData[19].innerHTML).contains('Mr Decider', 'Decision maker name does not exist');
    expect(summaryListData[20].innerHTML).contains('Both parties', 'Decision party notification does not exist');
  });

  it('should display the first row of older admin decisions with a space at the top', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[23].innerHTML).contains(adminDecisionRowHeader11, 'Header does not exist');
  });

  it('should display remaining admin decisions in descending order by application number', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[21].innerHTML).contains(
      '<br><br>Decision title 1 test text',
      'Decision title does not exist'
    );
    expect(summaryListData[22].innerHTML).contains('Granted', 'Decision does not exist');
    expect(summaryListData[23].innerHTML).contains('3 March 2023', 'Decision date does not exist');
    expect(summaryListData[24].innerHTML).contains('Tribunal', 'Decision maker does not exist');
    expect(summaryListData[25].innerHTML).contains('Judgment', 'Decision type does not exist');
    expect(summaryListData[26].innerHTML).contains(
      'Additional info 1 test text',
      'Decision additional info does not exist'
    );
    expect(summaryListData[27].innerHTML).contains('', 'Supporting material should be blank');
    expect(summaryListData[28].innerHTML).contains('Judge', 'Decision made by does not exist');
    expect(summaryListData[29].innerHTML).contains('Mr Judgey', 'Decision maker name does not exist');
    expect(summaryListData[30].innerHTML).contains('Both parties', 'Decision party notification does not exist');
  });
});
