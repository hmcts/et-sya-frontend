import request from 'supertest';

import { app } from '../../main/app';

describe('GET /past-employer', () => {
  it('should return the did you work for the employer page', async () => {
    const res = await request(app).get('/past-employer');
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe('on POST /past-employer with Yes', () => {
  test('should reload the current page when the Yes radio button is selected', async () => {
    await request(app)
      .post('/past-employer')
      .send({ 'past-employer': 'Yes' })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/past-employer');
      });
  });
});

describe('on POST /past-employer with No', () => {
  test('should reload the current page when the No radio button is selected', async () => {
    await request(app)
      .post('/past-employer')
      .send({ 'past-employer': 'No' })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/past-employer');
      });
  });
});
