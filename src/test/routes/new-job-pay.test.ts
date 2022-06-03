import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NEW_JOB_PAY}`, () => {
  it('should return the new job pay page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NEW_JOB_PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
