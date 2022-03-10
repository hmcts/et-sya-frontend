import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NOTICE_PAY}`, () => {
  it('should return the notice pay page', async () => {
    const res = await request(app).get(PageUrls.NOTICE_PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_PAY}`, () => {
  test('should navigate to the average weekly hours page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.NOTICE_END)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_PAY);
      });
  });
});
