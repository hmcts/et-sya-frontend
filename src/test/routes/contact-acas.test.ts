import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.CONTACT_ACAS}`, () => {
  it('should return the contact-acas page', async () => {
    const res = await request(app).get(PageUrls.CONTACT_ACAS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
