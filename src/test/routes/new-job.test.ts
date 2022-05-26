import request from 'supertest';

import { mockApp } from '../unit/mocks/mockApp';

const PAGE_URL = '/new-job';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the new job choice page', async () => {
    const res = await request(mockApp({})).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
