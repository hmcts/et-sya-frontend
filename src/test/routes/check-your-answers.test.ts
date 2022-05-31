import request from 'supertest';

import { mockApp } from '../unit/mocks/mockApp';

const PAGE_URL = '/check-your-answers';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the check your answers page', async () => {
    const res = await request(mockApp({})).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
