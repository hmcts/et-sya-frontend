import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COOKIE_PREFERENCES}`, () => {
  it('should return the cookie preferences page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COOKIE_PREFERENCES);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
