import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = PageUrls.RESPONDENT_APPLICATIONS;

describe(`GET ${pageUrl}`, () => {
  it('should return the respondent applications page', async () => {
    const res = await request(mockApp({})).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
