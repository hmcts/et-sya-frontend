import request from 'supertest';

import { app } from '../../main/app';
import { AuthUrls, PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';

describe(`GET ${PageUrls.TYPE_OF_CLAIM}`, () => {
  it('should return the type of claim page', async () => {
    const res = await request(app).get(PageUrls.TYPE_OF_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.TYPE_OF_CLAIM}`, () => {
  test('should return the type of claim claim page when is not selected "Breach of contract" is selected', async () => {
    await request(app)
      .post(PageUrls.TYPE_OF_CLAIM)
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
      .post(PageUrls.TYPE_OF_CLAIM)
      .send({
        typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(AuthUrls.LOGIN);
      });
  });
});
