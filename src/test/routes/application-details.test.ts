import request from 'supertest';

import { languages } from '../../main/definitions/constants';
import * as LaunchDarkly from '../../main/modules/featureFlag/launchDarkly';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/application-details/1' + languages.ENGLISH_URL_PARAMETER;

describe(`GET ${pageUrl}`, () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should return the do application details page for application number 1', async () => {
    const res = await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: '1',
              value: {
                number: '1',
              },
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
