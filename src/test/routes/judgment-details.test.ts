import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { SendNotificationType } from '../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, TranslationKeys } from '../../main/definitions/constants';
import { HubLinkStatus } from '../../main/definitions/hub';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.JUDGMENT_DETAILS}/1`, () => {
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
                notificationState: HubLinkStatus.VIEWED,
              } as SendNotificationType,
            },
          ],
        },
      })
    ).get(`/${TranslationKeys.JUDGMENT_DETAILS}/1`);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
