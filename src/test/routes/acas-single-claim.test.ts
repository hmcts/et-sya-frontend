import { expect } from 'chai';
import { YesOrNo } from 'definitions/case';
import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/do-you-have-an-acas-single-resps';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the acas single claim page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should return the acas single claim page when "correct data is enterered" is selected', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        isAcasSingle: YesOrNo.YES,
      })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/');
      });
  });

  test('should return the acas single claim page when "incorrect data is enterered"', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        isAcasSingle: undefined,
      })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal(PAGE_URL);
      });
  });
});
