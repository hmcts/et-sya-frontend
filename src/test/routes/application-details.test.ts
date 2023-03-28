import request from 'supertest';

import { languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/application-details/1' + languages.ENGLISH_URL_PARAMETER;

describe(`GET ${pageUrl}`, () => {
  it('should return the do application details page for application number 1', async () => {
    const res = await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
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
