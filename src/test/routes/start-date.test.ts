import request from 'supertest';

import { app } from '../../main/app';

describe('GET /start-date', () => {
  it('should return the employment start date page', async () => {
    const res = await request(app).get('/start-date');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
