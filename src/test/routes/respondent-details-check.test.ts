import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPONDENT_DETAILS_CHECK}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(mockApp({})).get(PageUrls.RESPONDENT_DETAILS_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
