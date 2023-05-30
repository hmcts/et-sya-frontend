import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

describe('Info page', () => {
  describe('on GET', () => {
    test('should return sample info page', async () => {
      await request(mockApp({}))
        .get('/info')
        .expect(res => expect(res.status).toStrictEqual(200));
    });
  });
});
