import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { SendNotificationType } from '../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = PageUrls.JUDGMENT_DETAILS;

describe(`GET ${pageUrl}`, () => {
  it('should return the judgment details page', async () => {
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
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
