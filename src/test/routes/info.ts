import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Info page', () => {
  describe('on GET', () => {
    test('should return sample info page', async () => {
      await request(app)
        .get('/info')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
