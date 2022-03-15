import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/work-address';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the work address page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the next page when a valid address is enterered', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        workAddressPostcode: 'AB11 5ND',
        workAddressCounty: 'Testshire',
        workAddressTown: 'Testtown',
        workAddress2: '',
        workAddress1: '10 test street',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
