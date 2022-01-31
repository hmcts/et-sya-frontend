import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /', () => {
  it('should return the onboarding (home) page', async () => {
    const res = await request(app).get('/');
    expect(res.type).to.equal('text/html');
    expect(res.statusCode).to.equal(200);
  });
});