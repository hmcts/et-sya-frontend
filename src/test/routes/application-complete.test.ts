import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.APPLICATION_COMPLETE}`, () => {
  it('should return the application complete page', async () => {
    const res = await request(mockApp({})).get(PageUrls.APPLICATION_COMPLETE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
