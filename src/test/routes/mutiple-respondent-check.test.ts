import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';

describe('GET /multiple-respondent-check', () => {
  it('should return multiple respondent page', async () => {
    const res = await request(app).get('/multiple-respondent-check');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /multiple-respondent-check', () => {
  test('should go back to home when an option has been selected', async () => {
    await request(app)
      .post('/multiple-respondent-check')
      .send({ isMultipleRespondent: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
