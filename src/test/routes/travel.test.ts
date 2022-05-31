import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TRAVEL}`, () => {
  it('should return the "need help travelling to, or around Tribunal buildings" page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TRAVEL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
