import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.PAY_BEFORE_TAX}`, () => {
  it('should return the pay before tax end page', async () => {
    const res = await request(app).get(PageUrls.PAY_BEFORE_TAX);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PAY_BEFORE_TAX}`, () => {
  test('should navigate to the pay after tax page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.PAY_BEFORE_TAX)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PAY_AFTER_TAX);
      });
  });
});
