import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';

const PAGE_URL = '/do-you-have-a-valid-no-acas-reason';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the valid no acas reason page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the valid no acas reason page when "correct data is entered" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        validNoAcasReason: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });

  test('should return the valid no acas reason page when "incorrect data is entered"', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        validNoAcasReason: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PAGE_URL);
      });
  });
});
