import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.ACAS_SINGLE_CLAIM}`, () => {
  it('should return the acas single claim page', async () => {
    const res = await request(app).get(PageUrls.ACAS_SINGLE_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ACAS_SINGLE_CLAIM}`, () => {
  test('should go to the types of claim page when "Yes" is selected', async () => {
    await request(app)
      .post(PageUrls.ACAS_SINGLE_CLAIM)
      .send({
        isAcasSingle: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TYPE_OF_CLAIM);
      });
  });

  test('should go to the do you have a valid reason page when "No" is selected', async () => {
    await request(app)
      .post(PageUrls.ACAS_SINGLE_CLAIM)
      .send({
        isAcasSingle: YesOrNo.NO,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NO_ACAS_NUMBER);
      });
  });

  test('should return the acas single claim page when "incorrect data is entered"', async () => {
    await request(app)
      .post(PageUrls.ACAS_SINGLE_CLAIM)
      .send({
        isAcasSingle: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ACAS_SINGLE_CLAIM);
      });
  });
});
