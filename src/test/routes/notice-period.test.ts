import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { StillWorking, YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_PERIOD}`, () => {
  it('should return notice period page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    ).get(PageUrls.NOTICE_PERIOD);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_PERIOD} with Yes`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should return the notice type page when the Yes radio button is selected', async () => {
    await request(mockApp({}))
      .post(`${PageUrls.NOTICE_PERIOD}`)
      .send({ noticePeriod: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.NOTICE_TYPE);
      });
  });
});

describe(`on POST ${PageUrls.NOTICE_PERIOD} with No`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should return the Average Weekly Hours page when the No radio button is selected', async () => {
    await request(mockApp({}))
      .post(`${PageUrls.NOTICE_PERIOD}`)
      .send({ noticePeriod: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.AVERAGE_WEEKLY_HOURS);
      });
  });
});
