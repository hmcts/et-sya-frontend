import request from 'supertest';

import { app } from '../../main/app';

describe('Steps to making your claim page', () => {
  describe('on GET', () => {
    test('should return steps to making your claim page', async () => {
      await request(app)
        .get('/steps-to-making-your-claim')
        .expect(res => expect(res.status).toStrictEqual(200));
    });
  });
});
