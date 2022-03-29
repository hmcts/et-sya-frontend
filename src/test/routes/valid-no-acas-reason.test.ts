import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NO_ACAS_NUMBER}`, () => {
  it('should return the valid no acas reason page', async () => {
    const res = await request(app).get(PageUrls.NO_ACAS_NUMBER);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NO_ACAS_NUMBER}`, () => {
  test('should return the valid no acas reason page when "correct data is entered" is selected', async () => {
    await request(app)
      .post(PageUrls.NO_ACAS_NUMBER)
      .send({
        validNoAcasReason: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/type-of-claim');
      });
  });

  test('should return the valid no acas reason page when "incorrect data is entered"', async () => {
    await request(app)
      .post(PageUrls.NO_ACAS_NUMBER)
      .send({
        validNoAcasReason: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NO_ACAS_NUMBER);
      });
  });
});
