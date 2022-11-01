import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.JOB_TITLE}`, () => {
  it('should return the job title page', async () => {
    const res = await request(mockApp({})).get(PageUrls.JOB_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.JOB_TITLE}`, () => {
  test('should navigate to the start date page when a job title is entered', async () => {
    await request(mockApp({}))
      .post(PageUrls.JOB_TITLE)
      .send({
        jobTitle: 'Vice President Branch Co-Manager',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.START_DATE);
      });
  });

  test('should navigate to the start date (Welsh language) page when the current language is Welsh and a job title is entered', async () => {
    await request(mockApp({}))
      .post(PageUrls.JOB_TITLE + languages.WELSH_URL_PARAMETER)
      .send({
        jobTitle: 'Vice President Branch Co-Manager',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.START_DATE + languages.WELSH_URL_PARAMETER);
      });
  });
});
