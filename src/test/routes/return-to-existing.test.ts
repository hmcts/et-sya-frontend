import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('GET /return-to-existing', () => {
  it('should return the return to existing page', async () => {
    const res = await request(app).get('/return-to-existing');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /return-to-existing', () => {
  test('should redirect to home page when an option is selected is selected', async () => {
    await request(app)
      .post('/return-to-existing')
      .send({'returnToExisting': 'Yes'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/');
      });
  });
});
