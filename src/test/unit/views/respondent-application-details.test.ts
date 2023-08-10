import fs from 'fs';
import path from 'path';

import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
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

const reqUrl = '/respondent-application-details/abc123';

const respondentAppRowHeader1 = respondentApplicationDetailsJSON.applicant;
const respondentAppRowHeader2 = respondentApplicationDetailsJSON.requestDate;
const respondentAppRowHeader3 = respondentApplicationDetailsJSON.applicationType;
const respondentAppRowHeader4 = respondentApplicationDetailsJSON.legend;
const respondentAppRowHeader5 = respondentApplicationDetailsJSON.supportingMaterial;
const respondentAppRowHeader6 = respondentApplicationDetailsJSON.copyCorrespondence;

const claimantResponseRowHeader1 = respondentApplicationDetailsJSON.responder;
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

const expectedResponseSummaryListHeader = 'Response 1';

let htmlRes: Document;

jest.mock('axios');
const axiosResponse: AxiosResponse = {
  data: {
    classification: 'PUBLIC',
    size: 10575,
    mimeType: 'application/pdf',
    originalDocumentName: 'sample.pdf',
    createdOn: '2022-09-08T14:39:32.000+00:00',
    createdBy: '7',
    lastModifiedBy: '7',
    modifiedOn: '2022-09-08T14:40:49.000+00:00',
    metadata: {
      jurisdiction: '',
      case_id: '1',
      case_type_id: '',
    },
  },
  status: 200,
  statusText: '',
  headers: undefined,
  config: undefined,
};

const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
getCaseApiClientMock.mockReturnValue(caseApi);
caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

xdescribe('Respondent Application details page', () => {
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
    expect(title[0].innerHTML).toContain(respondentApplicationDetailsJSON.applicationTo + 'amend response');
  });

  it('should display respondent application row headers', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[0].innerHTML).toContain(respondentAppRowHeader1);
    expect(rowHeader[1].innerHTML).toContain(respondentAppRowHeader2);
    expect(rowHeader[2].innerHTML).toContain(respondentAppRowHeader3);
    expect(rowHeader[3].innerHTML).toContain(respondentAppRowHeader4);
    expect(rowHeader[4].innerHTML).toContain(respondentAppRowHeader5);
    expect(rowHeader[5].innerHTML).toContain(respondentAppRowHeader6);
  });

  it('should display respondent application details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[0].innerHTML).toContain('Respondent');
    expect(summaryListData[1].innerHTML).toContain('7 March 2023');
    expect(summaryListData[2].innerHTML).toContain('amend response');
    expect(summaryListData[3].innerHTML).toContain('Test text');
    expect(summaryListData[4].innerHTML).toContain('');
    expect(summaryListData[5].innerHTML).toContain(YesOrNo.YES);
  });

  it('should display claimant response header', () => {
    const title = htmlRes.getElementsByClassName(summaryListTitleClass);
    expect(title[0].innerHTML).toContain(expectedResponseSummaryListHeader);
  });

  it('should display claimant response row headers', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[7].innerHTML).toContain(claimantResponseRowHeader1);
    expect(rowHeader[8].innerHTML).toContain(claimantResponseRowHeader2);
    expect(rowHeader[9].innerHTML).toContain(claimantResponseRowHeader3);
    expect(rowHeader[10].innerHTML).toContain(claimantResponseRowHeader4);
    expect(rowHeader[11].innerHTML).toContain(claimantResponseRowHeader5);
  });

  it('should display claimant response details', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[6].innerHTML).toContain('Claimant');
    expect(summaryListData[7].innerHTML).toContain('20 March 2023');
    expect(summaryListData[8].innerHTML).toContain('Response text');
    expect(summaryListData[9].innerHTML).toContain('');
    expect(summaryListData[10].innerHTML).toContain(YesOrNo.YES);
  });

  it('should display admin decision row headers for latest admin decision, with no space at the top of the table', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[12].innerHTML).toContain(adminDecisionRowHeader1);
    expect(rowHeader[13].innerHTML).toContain(adminDecisionRowHeader2);
    expect(rowHeader[14].innerHTML).toContain(adminDecisionRowHeader3);
    expect(rowHeader[15].innerHTML).toContain(adminDecisionRowHeader4);
    expect(rowHeader[16].innerHTML).toContain(adminDecisionRowHeader5);
    expect(rowHeader[17].innerHTML).toContain(adminDecisionRowHeader6);
    expect(rowHeader[18].innerHTML).toContain(adminDecisionRowHeader7);
    expect(rowHeader[19].innerHTML).toContain(adminDecisionRowHeader8);
    expect(rowHeader[20].innerHTML).toContain(adminDecisionRowHeader9);
    expect(rowHeader[21].innerHTML).toContain(adminDecisionRowHeader10);
  });

  it('if more than one admin decision, should display in order starting with the most recent', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[11].innerHTML).toContain('Decision title 2 test text');
    expect(summaryListData[12].innerHTML).toContain('Granted');
    expect(summaryListData[13].innerHTML).toContain('4 March 2023');
    expect(summaryListData[14].innerHTML).toContain('Tribunal');
    expect(summaryListData[15].innerHTML).toContain('Judgment');
    expect(summaryListData[16].innerHTML).toContain('Additional info 2 test text');
    expect(summaryListData[17].innerHTML).toContain('');
    expect(summaryListData[18].innerHTML).toContain('Judge');
    expect(summaryListData[19].innerHTML).toContain('Mr Decider');
    expect(summaryListData[20].innerHTML).toContain('Both parties');
  });

  it('should display the first row of older admin decisions with a space at the top', () => {
    const rowHeader = htmlRes.getElementsByClassName(summaryListKeyClass);
    expect(rowHeader[23].innerHTML).toContain(adminDecisionRowHeader11);
  });

  it('should display remaining admin decisions in descending order by application number', () => {
    const summaryListData = htmlRes.getElementsByClassName(summaryListValueClass);
    expect(summaryListData[21].innerHTML).toContain('<br><br>Decision title 1 test text');
    expect(summaryListData[22].innerHTML).toContain('Granted');
    expect(summaryListData[23].innerHTML).toContain('3 March 2023');
    expect(summaryListData[24].innerHTML).toContain('Tribunal');
    expect(summaryListData[25].innerHTML).toContain('Judgment');
    expect(summaryListData[26].innerHTML).toContain('Additional info 1 test text');
    expect(summaryListData[27].innerHTML).toContain('');
    expect(summaryListData[28].innerHTML).toContain('Judge');
    expect(summaryListData[29].innerHTML).toContain('Mr Judgey');
    expect(summaryListData[30].innerHTML).toContain('Both parties');
  });
});

xdescribe('reply button link', () => {
  it('should link to respond-to-respondent when no responses yet', async () => {
    await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: 'abc123',
              value: {
                date: '3 July 2023',
                type: 'Change personal details',
                number: '1',
                status: 'Open',
                details: 'look ma, flexUI populated',
                dueDate: '10 July 2023',
                applicant: 'Respondent',
                responsesCount: '1',
                applicationState: 'notStartedYet',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
                claimantResponseRequired: 'No',
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

    const button = htmlRes.getElementById('respond-button');
    expect((button as HTMLAnchorElement).href).toContain('/respond-to-application/abc123');
  });

  it('should link to respond-to-tribunal', async () => {
    await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: 'abc123',
              value: {
                date: '3 July 2023',
                type: 'Change personal details',
                number: '1',
                status: 'Open',
                details: 'look ma, flexUI populated',
                dueDate: '10 July 2023',
                applicant: 'Respondent',
                responsesCount: '1',
                applicationState: 'notStartedYet',
                respondCollection: [
                  {
                    id: '77cc7dee-1187-45b1-ad0b-51f4d623efbd',
                    value: {
                      date: '3 July 2023',
                      from: 'Admin',
                      addDocument: [
                        {
                          id: '41266f16-355e-4e31-81a7-7f8e184836b6',
                          value: {
                            uploadedDocument: {
                              document_url: 'http://dm-store:8080/documents/be30afc8-2c18-4f9f-a2ac-9c1b7f7be0da',
                              document_filename: 'et1_a_b.pdf',
                              document_binary_url:
                                'http://dm-store:8080/documents/be30afc8-2c18-4f9f-a2ac-9c1b7f7be0da/binary',
                            },
                          },
                        },
                      ],
                      requestMadeBy: 'Legal officer',
                      isCmoOrRequest: 'Request',
                      madeByFullName: 'asf',
                      selectPartyNotify: 'Both parties',
                      isResponseRequired: 'Yes',
                      selectPartyRespond: 'Claimant',
                    },
                  },
                ],
                copyToOtherPartyYesOrNo: YesOrNo.YES,
                claimantResponseRequired: 'Yes',
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

    const button = htmlRes.getElementById('respond-button');
    expect((button as HTMLAnchorElement).href).toContain('/respond-to-tribunal-response/abc123');
  });

  it("no links to respond when answered tribunal's request", async () => {
    await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: 'abc123',
              value: {
                date: '3 July 2023',
                type: 'Change personal details',
                number: '2',
                status: 'Open',
                details: 'look ma, flexUI populated',
                dueDate: '10 July 2023',
                applicant: 'Respondent',
                responsesCount: '2',
                applicationState: 'waitingForTheTribunal',
                respondCollection: [
                  {
                    id: '20587e8a-a55d-4c4e-8a8a-6b0ca2a7d079',
                    value: {
                      date: '3 July 2023',
                      from: 'Admin',
                      addDocument: [
                        {
                          id: '8e7e6325-6f95-4433-aff6-69ee1a744021',
                          value: {
                            uploadedDocument: {
                              document_url: 'http://dm-store:8080/documents/e8f02c1e-e4be-48c8-b7ed-0a6abe399940',
                              document_filename: 'et1_a_b.pdf',
                              document_binary_url:
                                'http://dm-store:8080/documents/e8f02c1e-e4be-48c8-b7ed-0a6abe399940/binary',
                            },
                          },
                        },
                      ],
                      requestMadeBy: 'Legal officer',
                      isCmoOrRequest: 'Request',
                      madeByFullName: 'sad',
                      selectPartyNotify: 'Claimant only',
                      isResponseRequired: 'Yes',
                      selectPartyRespond: 'Claimant',
                    },
                  },
                  {
                    id: '272b5e2f-d881-47e8-b6a2-1b4a7c7fd0f9',
                    value: {
                      date: '3 July 2023',
                      from: 'Claimant',
                      response: 'ads',
                      copyToOtherParty: 'Yes',
                      hasSupportingMaterial: YesOrNo.NO,
                    },
                  },
                ],
                copyToOtherPartyYesOrNo: YesOrNo.YES,
                claimantResponseRequired: 'No',
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

    const button = htmlRes.getElementById('respond-button');
    expect(button).toBeNull();
  });
});
