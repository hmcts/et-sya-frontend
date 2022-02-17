import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.ADDRESS_DETAILS}`, () => {
  it('should return the address details page', async () => {
    const res = await request(app).get(PageUrls.ADDRESS_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ADDRESS_DETAILS}`, () => {
  test('should go to telephone number page when correct address data is entered', async () => {
    await request(app)
      .post(PageUrls.ADDRESS_DETAILS)
      .send({
        addressPostcode: 'AB11 5ND',
        addressCounty: 'Testshire',
        addressTown: 'Testtown',
        address2: '',
        address1: '10 test street',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TELEPHONE_NUMBER);
      });
  });
});
