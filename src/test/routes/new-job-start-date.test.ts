import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/new-job-start-date';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the new job start date page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
