import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/job-title';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the job title page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should navigate to the next page when a job title is entered', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        jobTitle: 'Vice President Branch Co-Manager',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        // page to be implemented, this test will need updated
        expect(res.header['location']).toStrictEqual('/');
      });
  });
});
