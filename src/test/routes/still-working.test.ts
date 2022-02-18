import request from 'supertest';

import { app } from '../../main/app';

describe('GET /are-you-still-working', () => {
  it('should return the are you still working page page', async () => {
    const res = await request(app).get('/are-you-still-working');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /are-you-still-working', () => {
  test('should return the employment details(WORKING) page', async () => {
    await request(app)
      .post('/')
      .send({ isStillWorking: 'WORKING' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        // page to be implemented, this test will need updated
        expect(res.header['location']).toStrictEqual('/');
      });
  });
  test('should return the employment details(NOTICE) page', async () => {
    await request(app)
      .post('/')
      .send({ isStillWorking: 'NOTICE' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        // page to be implemented, this test will need updated
        expect(res.header['location']).toStrictEqual('/');
      });
  });
  test('should return the employment details(NO LONGER WORKING) page', async () => {
    await request(app)
      .post('/')
      .send({ isStillWorking: 'NO LONGER WORKING' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        // page to be implemented, this test will need updated
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
