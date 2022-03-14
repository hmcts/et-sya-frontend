import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.DESIRED_CLAIM_OUTCOME}`, () => {
  it('should return the desired claim outcome page', async () => {
    const res = await request(app).get(PageUrls.DESIRED_CLAIM_OUTCOME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.DESIRED_CLAIM_OUTCOME}`, () => {
  test('should go back to claim steps page', async () => {
    await request(app)
      .post(PageUrls.DESIRED_CLAIM_OUTCOME)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});
