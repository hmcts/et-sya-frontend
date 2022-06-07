import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_STEPS}`, () => {
  it('should return the claim steps page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_STEPS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
