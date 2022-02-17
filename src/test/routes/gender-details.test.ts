import request from 'supertest';

import { app } from '../../main/app';

describe('GET /gender-details', () => {
  it('should return the gender details page', async () => {
    const res = await request(app).get('/gender-details');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
