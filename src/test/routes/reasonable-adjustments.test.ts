import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REASONABLE_ADJUSTMENTS}`, () => {
  it('should return the reasonable adjustments page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REASONABLE_ADJUSTMENTS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
