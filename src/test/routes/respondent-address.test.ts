import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPONDENT_ADDRESS}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          selectedRespondent: 1,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    ).get(PageUrls.RESPONDENT_ADDRESS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
