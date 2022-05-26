import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.DOCUMENTS}`, () => {
  it('should return the "need documents in an alternative format" page', async () => {
    const res = await request(mockApp({})).get(PageUrls.DOCUMENTS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
