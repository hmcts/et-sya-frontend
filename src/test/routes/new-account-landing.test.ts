import { expect } from 'chai';
import request from 'supertest';


import { app } from '../../main/app';

describe('GET /new-account-landing', () => {
  it('should return the new account landing page', async () => {
    const res = await request(app).get('/new-account-landing');
    expect(res.type).to.equal('text/html');
    expect(res.statusCode).to.equal(200);
  });
});