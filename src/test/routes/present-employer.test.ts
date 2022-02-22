import request from 'supertest';

import { app } from '../../main/app';

describe('GET /present-employer', () => {
  it('should return the how did you work for the employer page', async () => {
    const res = await request(app).get('/present-employer');
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe('on POST /present-employer with Yes', () => {
  test('should reload the current page when the Yes radio button is selected', async () => {
    await request(app)
      .post('/present-employer')
      .send({ 'present-employer': 'Yes' })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/present-employer');
      });
  });
});

describe('on POST /present-employer with No', () => {
  test('should reload the current page when the No radio button is selected', async () => {
    await request(app)
      .post('/present-employer')
      .send({ 'present-employer': 'No' })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/present-employer');
      });
  });
});
