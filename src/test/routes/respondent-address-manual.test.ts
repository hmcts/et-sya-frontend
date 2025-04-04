import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/respondent/1/respondent-address-manual';

describe(`GET ${PageUrls.RESPONDENT_ADDRESS_MANUAL}`, () => {
  it('should return the respondent name page for manual address entry', async () => {
    const res = await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'testName',
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
