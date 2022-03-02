import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/your-claim-has-been-submitted';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the claim submitted confirmation page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
