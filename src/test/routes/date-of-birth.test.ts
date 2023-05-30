import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

describe(`GET ${PageUrls.DOB_DETAILS}`, () => {
  it('should return the date of birth page', async () => {
    const res = await request(mockApp({})).get(PageUrls.DOB_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
