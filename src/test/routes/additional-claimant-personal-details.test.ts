import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}`, () => {
  it('should return the other claimant personal details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
