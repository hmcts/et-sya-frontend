import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.DOB_DETAILS}`, () => {
  it('should return the date of birth page', async () => {
    const res = await request(app).get(PageUrls.DOB_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
