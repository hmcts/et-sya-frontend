import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COMFORTABLE}`, () => {
  it('should return the "need something to make me feel comfortable" page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COMFORTABLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
