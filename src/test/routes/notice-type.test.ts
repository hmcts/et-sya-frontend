import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { StillWorking, WeeksOrMonths } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_TYPE}`, () => {
  it('should return the notice type page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    ).get(PageUrls.NOTICE_TYPE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_TYPE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should navigate to the notice length page when weeks radio button is selected and save and continue button is clicked', async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.WORKING,
        },
      })
    )
      .post(PageUrls.NOTICE_TYPE)
      .send({ noticePeriodUnit: WeeksOrMonths.WEEKS })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_LENGTH);
      });
  });
});
