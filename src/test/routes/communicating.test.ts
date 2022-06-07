import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COMMUNICATING}`, () => {
  it('should return the "need help communicating and understanding" page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COMMUNICATING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
