import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { SendNotificationType } from '../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = PageUrls.ALL_JUDGMENTS;

describe(`GET ${pageUrl}`, () => {
  it('should return the all judgments page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          sendNotificationCollection: [
            {
              id: '1',
              value: {
                sendNotificationSubjectString: 'Judgment',
                sendNotificationResponseTribunal: YesOrNo.YES,
                sendNotificationTitle: 'test',
              } as SendNotificationType,
            },
          ],
          genericTseApplicationCollection: [
            {
              id: '1',
              value: {
                applicant: 'Respondent',
                date: '2022-05-05',
                type: 'Amend my claim',
                copyToOtherPartyText: YesOrNo.YES,
                details: 'Help',
                number: '1',
                status: 'notViewedYet',
                dueDate: '2022-05-12',
                applicationState: 'notViewedYet',
                adminDecision: [
                  {
                    id: '1',
                    value: {
                      date: '2022-05-05',
                      decision: 'Granted',
                      decisionMadeBy: 'Judge',
                      typeOfDecision: 'Judgment',
                      selectPartyNotify: 'Both parties',
                      decisionMadeByFullName: 'Mr Test Judge',
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
