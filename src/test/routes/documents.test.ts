import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.DOCUMENTS}`, () => {
  it('should return the type of claim page', async () => {
    const res = await request(app).get(PageUrls.DOCUMENTS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
