import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Onboarding page', () => {
  describe('on GET', () => {
    test('should return sample onboarding page', async () => {
      await request(app)
        .get('/')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
