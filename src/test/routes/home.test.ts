import request from 'supertest';

import { mockApp } from '../unit/mocks/mockApp';

describe('GET /', () => {
  it('should return the onboarding (home) page', async () => {
    const res = await request(mockApp({})).get('/');
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
