import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.CLAIM_STEPS}`, () => {
  it('should return the claim steps page', async () => {
    const res = await request(app).get(PageUrls.CLAIM_STEPS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
