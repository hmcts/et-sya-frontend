import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe('Your claim has been saved page', () => {
  describe(`on GET ${PageUrls.CLAIM_SAVED}`, () => {
    test('should return your claim has been saved page', async () => {
      await request(app)
        .get(PageUrls.CLAIM_SAVED)
        .expect(res => expect(res.status).toStrictEqual(200));
    });
  });
});
