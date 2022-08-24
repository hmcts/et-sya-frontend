import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.COOKIE_PREFERENCES}`, () => {
  it('should return the cookie preferences page', async () => {
    const res = await request(app).get(PageUrls.COOKIE_PREFERENCES);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
