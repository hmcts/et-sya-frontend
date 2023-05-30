import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

import request from 'supertest';

const pageUrl = '/respondent/1/respondent-address';

describe(`GET ${PageUrls.RESPONDENT_ADDRESS}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
