import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SUPPORT}`, () => {
  it('should return "need to bring support with me" page', async () => {
    const res = await request(mockApp({})).get(PageUrls.SUPPORT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
