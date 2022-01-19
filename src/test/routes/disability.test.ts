import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Disability contact page', () => {
  describe('on GET', () => {
    test('should return disability contact page', async () => {
      await request(app)
        .get('/your-contact-details-disability')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});