import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('GET /multiple-respondent-check', () => {
  it('should return multiple respondent page', async () => {
    const res = await request(app).get('/multiple-respondent-check');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /multiple-respondent-check', () => {
  test('should go back to home when an option has been selected', async () => {
    await request(app)
      .post('/multiple-respondent-check')
      .send({ 'multipleRespondent': 'Yes' })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/');
      });
  });
});
