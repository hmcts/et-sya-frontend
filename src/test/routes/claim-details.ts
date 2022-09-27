import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_DETAILS}`, () => {
  it('should return the citizen hub page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_DETAILS);

    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
