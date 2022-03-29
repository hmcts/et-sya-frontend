import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NEW_ACCOUNT_LANDING}`, () => {
  it('should return the new account landing page', async () => {
    const res = await request(app).get(PageUrls.NEW_ACCOUNT_LANDING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
