import request from 'supertest';

import { app } from '../../main/app';

describe('GET /dob-details', () => {
  it('should return the date of birth page', async () => {
    const res = await request(app).get('/dob-details');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /dob-details', () => {
  test('should return the Gender details page when "correct date is enterered" is selected', async () => {
    await request(app)
      .post('/dob-details')
      .send({
        'dobDate-year': '2000',
        'dobDate-month': '12',
        'dobDate-day': '24',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/gender-details');
      });
  });
});
