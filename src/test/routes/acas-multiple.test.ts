import request from 'supertest';

import { app } from '../../main/app';

describe('GET /do-you-have-an-acas-no-many-resps', () => {
  it('should return the do you have an Acas certificate page', async () => {
    const res = await request(app).get('/do-you-have-an-acas-no-many-resps');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /do-you-have-an-acas-no-many-resps', () => {
  test('should reload the current page when the Yes radio button is selected', async () => {
    await request(app)
      .post('/do-you-have-an-acas-no-many-resps')
      .send({ 'acas-multiple': 'Yes' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/do-you-have-an-acas-no-many-resps');
      });
  });
});

test('should reload the current page when the No radio button is selected', async () => {
  await request(app)
    .post('/do-you-have-an-acas-no-many-resps')
    .send({ 'acas-multiple': 'No' })
    .expect(res => {
      expect(res.status).toStrictEqual(302);
      expect(res.header['location']).toStrictEqual('/do-you-have-an-acas-no-many-resps');
    });
});
