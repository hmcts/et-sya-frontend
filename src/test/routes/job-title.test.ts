import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.JOB_TITLE}`, () => {
  it('should return the job title page', async () => {
    const res = await request(app).get(PageUrls.JOB_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.JOB_TITLE}`, () => {
  test('should navigate to the start date page when a job title is entered', async () => {
    await request(app)
      .post(PageUrls.JOB_TITLE)
      .send({
        jobTitle: 'Vice President Branch Co-Manager',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.START_DATE);
      });
  });
});
