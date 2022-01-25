import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /checklist', () => {
  it('should return the checklist page', async () => {
    const res = await request(app).get('/checklist');
    expect(res.type).to.equal('text/html');
    expect(res.statusCode).to.equal(200);
  });
});