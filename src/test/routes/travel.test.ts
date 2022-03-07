import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.TRAVEL}`, () => {
  it('should return the "need help travelling to, or around Tribunal buildings" page', async () => {
    const res = await request(app).get(PageUrls.TRAVEL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
