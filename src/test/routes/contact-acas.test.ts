import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /contact-acas', () => {
  it('should return the contact-acas page', async () => {
    const res = await request(app).get('/contact-acas');
    expect(res.type).equal('text/html');
    expect(res.statusCode).equal(200);
  });
});
