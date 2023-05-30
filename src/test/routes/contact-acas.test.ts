import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

describe(`GET ${PageUrls.CONTACT_ACAS}`, () => {
  it('should return the contact-acas page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CONTACT_ACAS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
