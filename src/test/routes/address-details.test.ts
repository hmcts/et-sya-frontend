import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/address-details';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the address details page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the address details page when "correct date is enterered" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        addressPostcode: 'AB11 5ND',
        addressCounty: 'Testshire',
        addressTown: 'Testtown',
        address2: '',
        address1: '10 test street',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
