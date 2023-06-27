import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { mockApp } from '../mocks/mockApp';

const textJSONRaw = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/respond-to-tribunal-response.json'),
    'utf-8'
  )
);

const reqUrl = '/respond-to-tribunal-response/abc123';

const titleClass = 'govuk-heading-xl govuk-!-margin-bottom-4';
const responseHeaderClass = 'govuk-summary-list__key govuk-heading-m govuk-!-margin-top-1';
const responseLabelClass = 'govuk-label govuk-label--m';
const responseHint = 'govuk-hint';

let htmlRes: Document;
describe('Respond to Tribunal response page', () => {
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
                  {
                    id: '2',
                    value: {
                      from: 'Admin',
                      date: '21 March 2023',
                      enterResponseTitle: 'Provide info',
                      isCmoOrRequest: 'Request',
                      requestMadeBy: 'Judge',
                      isResponseRequired: 'Yes',
                      selectPartyRespond: 'Claimant',
                      selectPartyNotify: 'Claimant',
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
    expect(title[0].innerHTML).contains(textJSONRaw.title);
  });

  it('should display response header', () => {
    const responseHeader = htmlRes.getElementsByClassName(responseHeaderClass);
    expect(responseHeader[0].innerHTML).contains(textJSONRaw.responseItem + ' 1');
  });

  it('should show response text box label', () => {
    const labels = htmlRes.getElementsByClassName(responseLabelClass);
    expect(labels[0].innerHTML).contains("What's your response to the tribunal?");
  });

  it('should show response hint', () => {
    const hints = htmlRes.getElementsByClassName(responseHint);
    expect(hints[0].innerHTML).contains('Use this box to respond or you can upload material at the next step.');
  });

  it('should show supporting material hint', () => {
    const hints = htmlRes.getElementsByClassName(responseHint);
    expect(hints[1].innerHTML).contains('Do you have any supporting material you want to provide?');
  });
});
