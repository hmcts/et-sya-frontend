import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REASONABLE_ADJUSTMENTS}`, () => {
  it('should not return the old reasonable adjustments page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REASONABLE_ADJUSTMENTS);
    expect(res.status).toStrictEqual(404);
  });
});
