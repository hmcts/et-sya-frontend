import request from 'supertest';

import { app } from '../../main/app';

describe('GET /are-you-still-working', () => {
  it('should return the are you still working page page', async () => {
    const res = await request(app).get('/are-you-still-working');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
