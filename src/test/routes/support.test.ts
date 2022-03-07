import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.SUPPORT}`, () => {
  it('should return "need to bring support with me" page', async () => {
    const res = await request(app).get(PageUrls.SUPPORT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
