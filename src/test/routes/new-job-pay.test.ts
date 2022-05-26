import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NEW_JOB_PAY}`, () => {
  it('should return the new job pay page', async () => {
    const res = await request(app).get(PageUrls.NEW_JOB_PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
