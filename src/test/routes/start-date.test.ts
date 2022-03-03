import request from 'supertest';

import { app } from '../../main/app';

describe('GET /employment-details-start-date', () => {
  it('should return the employment start date page', async () => {
    const res = await request(app).get('/employment-details-start-date');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /employment-details-start-date', () => {
  test('should return the home page when "correct date is enterered" is selected', async () => {
    await request(app)
      .post('/employment-details-start-date')
      .send({
        'startDate-year': '2010',
        'startDate-month': '04',
        'startDate-day': '24',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
