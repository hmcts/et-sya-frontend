import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const respondentAddressUrl = '/respondent/1/respondent-address';

describe(`GET ${PageUrls.RESPONDENT_NAME}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(mockApp({})).get(PageUrls.FIRST_RESPONDENT_NAME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RESPONDENT_NAME}`, () => {
  test('should go to the respondent address page when name is given', async () => {
    await request(mockApp({}))
      .post(PageUrls.FIRST_RESPONDENT_NAME)
      .send({ respondentName: 'Globo Gym' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(respondentAddressUrl);
      });
  });

  test('should go to the respondent address (Welsh language) page when the current language is Welsh and name is given', async () => {
    await request(mockApp({}))
      .post(PageUrls.FIRST_RESPONDENT_NAME + languages.WELSH_URL_PARAMETER)
      .send({ respondentName: 'Globo Gym' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(respondentAddressUrl + languages.WELSH_URL_PARAMETER);
      });
  });
});
