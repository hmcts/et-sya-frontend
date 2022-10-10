import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp, mockEmptyApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_DETAILS}`, () => {
  it('should return the citizen hub page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_DETAILS);

    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });

  it('should redirect away from citizen hub page with empty case', async () => {
    const res = await request(mockEmptyApp()).get(PageUrls.CLAIM_DETAILS);

    expect(res.status).toStrictEqual(302);
    expect(res.header['location']).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });
});
