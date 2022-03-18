import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.CHECKLIST}`, () => {
  it('should return the checklist page', async () => {
    const res = await request(app).get(PageUrls.CHECKLIST);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
