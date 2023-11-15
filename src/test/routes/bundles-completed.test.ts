import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.BUNDLES_COMPLETED}`, () => {
  it('should return the bundles completed page', async () => {
    const res = await request(mockApp({})).get(PageUrls.BUNDLES_COMPLETED);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
