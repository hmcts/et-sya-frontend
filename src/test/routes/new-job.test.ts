import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/new-job';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the new job choice page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
