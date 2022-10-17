import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CHECKLIST}`, () => {
  it('should return the checklist page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CHECKLIST);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
