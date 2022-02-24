import request from 'supertest';

import { app } from '../../main/app';

describe('GET /contact-acas', () => {
  it('should return the contact-acas page', async () => {
    const res = await request(app).get('/contact-acas');
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
