import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.COMMUNICATING}`, () => {
  it('should return the "need help communicating and understanding" page', async () => {
    const res = await request(app).get(PageUrls.COMMUNICATING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
