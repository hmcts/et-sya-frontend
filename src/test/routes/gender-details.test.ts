import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.GENDER_DETAILS}`, () => {
  it('should return the gender details page', async () => {
    const res = await request(app).get(PageUrls.GENDER_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
