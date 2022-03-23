import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.END_DATE}`, () => {
  it('should return the end date page', async () => {
    const res = await request(app).get(PageUrls.END_DATE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.END_DATE}`, () => {
  test('should navigate to the notice period page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.END_DATE)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_PERIOD);
      });
  });
});
