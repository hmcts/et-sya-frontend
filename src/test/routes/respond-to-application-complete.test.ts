import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import * as LaunchDarkly from '../../main/modules/featureFlag/launchDarkly';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPOND_TO_APPLICATION_COMPLETE}`, () => {
  it('should return the response complete page', async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    const res = await request(mockApp({})).get(PageUrls.RESPOND_TO_APPLICATION_COMPLETE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
