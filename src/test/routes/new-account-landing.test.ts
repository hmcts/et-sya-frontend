import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NEW_ACCOUNT_LANDING}`, () => {
  it('should return the new account landing page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NEW_ACCOUNT_LANDING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
