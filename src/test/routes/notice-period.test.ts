import request from 'supertest';

import { app } from '../../main/app';
import { WeeksOrMonths, YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NOTICE_PERIOD}`, () => {
  it('should return notice period page', async () => {
    const res = await request(app).get(`${PageUrls.NOTICE_PERIOD}`);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_PERIOD} with Yes`, () => {
  test('should go to next page the Yes radio button is selected', async () => {
    await request(app)
      .post(`${PageUrls.NOTICE_PERIOD}`)
      .send({ noticePeriod: YesOrNo.YES, noticePeriodLength: '2', noticePeriodUnit: WeeksOrMonths.WEEKS })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.AVERAGE_WEEKLY_HOURS);
      });
  });
});

describe(`on POST ${PageUrls.NOTICE_PERIOD} with No`, () => {
  test('should go to next page when the No radio button is selected', async () => {
    await request(app)
      .post(`${PageUrls.NOTICE_PERIOD}`)
      .send({ noticePeriod: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.AVERAGE_WEEKLY_HOURS);
      });
  });
});
