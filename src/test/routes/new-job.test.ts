import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.NEW_JOB}`, () => {
  it('should return the new job page', async () => {
    const res = await request(app).get(PageUrls.NEW_JOB);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NEW_JOB} with Yes`, () => {
  test('should return the new job page when Yes radio button is selected', async () => {
    await request(app)
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
    await request(app)
      .post(`${PageUrls.NEW_JOB}`)
      .send({ newJob: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual(PageUrls.HOME);
      });
  });
});
