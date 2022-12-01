import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPONDENT_NAME}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(mockApp({})).get(PageUrls.FIRST_RESPONDENT_NAME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RESPONDENT_NAME}`, () => {
  test('should go to the respondent address page when name is given', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(mockApp({}))
      .post(PageUrls.FIRST_RESPONDENT_NAME)
      .send({ respondentName: 'Globo Gym' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/respondent/1/respondent-address');
      });
  });
});
