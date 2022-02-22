import request from 'supertest';

import { app } from '../../main/app';
import { AuthUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';

const PAGE_URL = '/type-of-claim';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the type of claim page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the type of claim claim page when is not selected "Breach of contract" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        typeOfClaim: [],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/type-of-claim');
      });
  });

  test('should navigate to login page when "Breach of contract" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(AuthUrls.LOGIN);
      });
  });
});
