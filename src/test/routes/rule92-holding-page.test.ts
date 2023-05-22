import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RULE92_HOLDING_PAGE}`, () => {
  it('should return the rule 92 holding page', async () => {
    const res = await request(mockApp({})).get(PageUrls.RULE92_HOLDING_PAGE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
