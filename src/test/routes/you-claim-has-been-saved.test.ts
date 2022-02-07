import request from 'supertest';

import { app } from '../../main/app';

describe('Your claim has been saved page', () => {
  describe('on GET', () => {
    test('should return your claim has been saved page', async () => {
      await request(app)
        .get('/your-claim-has-been-saved')
        .expect(res => expect(res.status).toStrictEqual(200));
    });
  });
});
