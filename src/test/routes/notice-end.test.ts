import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NOTICE_END}`, () => {
  it('should return the notice end page', async () => {
    const res = await request(app).get(PageUrls.NOTICE_END);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_END}`, () => {
  test('should navigate to the notice pay page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.NOTICE_END)
      .send({ 'noticeEnds-day': '10', 'noticeEnds-month': '10', 'noticeEnds-year': '2014' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_PAY);
      });
  });
});
