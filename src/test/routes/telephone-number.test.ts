import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

const PAGE_URL = '/telephone-number';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the telephone number page', async () => {
    const res = await request(app).get(PAGE_URL);
    expect(res.type).equal('text/html');
    expect(res.status).equal(200);
  });
});

describe(`on POST ${PAGE_URL}`, () => {
  test('should navigate to the next page when phone number has been entered', async () => {
    await request(app)
      .post(PAGE_URL)
      .send({
        telNumber: '01234567890',
      })
      .expect(res => {
        expect(res.status).equal(302);
        expect(res.header['location']).equal('/how-would-you-like-to-be-updated-about-your-claim');
      });
  });
});
