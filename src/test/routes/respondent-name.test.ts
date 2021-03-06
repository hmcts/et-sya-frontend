import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPONDENT_NAME}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(mockApp({})).get(PageUrls.RESPONDENT_NAME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RESPONDENT_NAME}`, () => {
  test('should go to the respondent address page when name is given', async () => {
    await request(mockApp({}))
      .post(PageUrls.RESPONDENT_NAME)
      .send({ respondentName: 'Globo Gym' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.RESPONDENT_ADDRESS);
      });
  });
});
