import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.VALID_ACAS_REASON}`, () => {
  it('should return the valid no acas reason page', async () => {
    const res = await request(app).get(PageUrls.VALID_ACAS_REASON);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.VALID_ACAS_REASON}`, () => {
  test('should return the valid no acas reason page when "correct data is entered" is selected', async () => {
    await request(app)
      .post(PageUrls.VALID_ACAS_REASON)
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
      .post(PageUrls.VALID_ACAS_REASON)
      .send({
        validNoAcasReason: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VALID_ACAS_REASON);
      });
  });
});
