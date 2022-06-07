import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe('Your claim has been saved page', () => {
  describe(`on GET ${PageUrls.CLAIM_SAVED}`, () => {
    test('should return your claim has been saved page', async () => {
      await request(mockApp({}))
        .get(PageUrls.CLAIM_SAVED)
        .expect(res => expect(res.status).toStrictEqual(200));
    });
  });
});
