import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const PAGE_URL = PageUrls.CLAIM_SUBMITTED;

describe(`GET ${PAGE_URL}`, () => {
  it('should return the claim submitted confirmation page', async () => {
    const res = await request(mockApp({})).get(PAGE_URL + languages.ENGLISH_URL_PARAMETER);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
