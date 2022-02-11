import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';

const PAGE_URL = '/do-you-have-an-acas-single-resps';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the acas single claim page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the acas single claim page when "Yes" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        isAcasSingle: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/type-of-claim');
      });
  });

  test('should return the do you have a valid reason when "No" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        isAcasSingle: YesOrNo.NO,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });

  test('should return the acas single claim page when "incorrect data is enterered"', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        isAcasSingle: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PAGE_URL);
      });
  });
});
