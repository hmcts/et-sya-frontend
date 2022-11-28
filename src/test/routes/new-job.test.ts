import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NEW_JOB}`, () => {
  it('should return the new job page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NEW_JOB);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
// There should be updates for mocking calls for et-sya-api
describe(`on POST ${PageUrls.NEW_JOB} with Yes`, () => {
  test('should return the new job page when Yes radio button is selected', async () => {
    await request(mockApp({}))
      .post(`${PageUrls.NEW_JOB}`)
      .send({ newJob: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.NEW_JOB_START_DATE);
      });
  });
});

// TODO - redirect to the Respondent Name page
describe(`on POST ${PageUrls.NEW_JOB} with No`, () => {
  test('should return the home page when the No radio button is selected', async () => {
    await request(mockApp({}))
      .post(`${PageUrls.NEW_JOB}`)
      .send({ newJob: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.FIRST_RESPONDENT_NAME);
      });
  });
});
