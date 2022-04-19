import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.GENDER_DETAILS}`, () => {
  it('should return the gender details page', async () => {
    const res = await request(app).get(PageUrls.GENDER_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.GENDER_DETAILS}`, () => {
  test('should go to the address details page', async () => {
    await request(app)
      .post(PageUrls.GENDER_DETAILS)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADDRESS_DETAILS);
      });
  });
});
