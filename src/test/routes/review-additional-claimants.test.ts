import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REVIEW_ADDITIONAL_CLAIMANTS}`, () => {
  it('should return the review other claimants page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REMOVE_ADDITIONAL_CLAIMANT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
