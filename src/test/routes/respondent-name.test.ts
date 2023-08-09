import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls, RespondentType } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.RESPONDENT_NAME}`, () => {
  it('should return the respondent name page', async () => {
    const res = await request(mockApp({})).get(PageUrls.FIRST_RESPONDENT_NAME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.RESPONDENT_NAME}`, () => {
  test('should go to the respondent address page when first name and last name are given', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(mockApp({}))
      .post(PageUrls.FIRST_RESPONDENT_NAME)
      .send({
        respondentType: RespondentType.INDIVIDUAL,
        respondentFirstName: 'George',
        respondentLastName: 'Costanza',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/respondent/1/respondent-postcode-enter');
      });
  });
});

describe(`on POST ${PageUrls.RESPONDENT_NAME}`, () => {
  test('should go to the respondent address page when organisation is given', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(mockApp({}))
      .post(PageUrls.FIRST_RESPONDENT_NAME)
      .send({ respondentType: RespondentType.ORGANISATION, respondentOrganisation: 'Vandelay Industries' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/respondent/1/respondent-postcode-enter');
      });
  });
});
