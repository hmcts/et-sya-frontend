import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

jest.mock('node-fetch', () => jest.fn());

describe(`GET ${PageUrls.PLACE_OF_WORK}`, () => {
  it('should go to place of work page', async () => {
    const res = await request(app).get(PageUrls.PLACE_OF_WORK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PLACE_OF_WORK}`, () => {
  test('should redirect to home on submit', async () => {
    await request(app)
      .post(PageUrls.PLACE_OF_WORK)
      .send({
        workAddress1: '31 The Street',
        workAddress12: '',
        workAddressTown: 'Exeter',
        workAddressCounty: '',
        workAddressPostcode: 'EX7 8KK',
      })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.HOME);
      });
  });
});
