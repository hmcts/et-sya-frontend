import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.TELEPHONE_NUMBER}`, () => {
  it('should return the telephone number page', async () => {
    const res = await request(app).get(PageUrls.TELEPHONE_NUMBER);
    expect(res.type).equal('text/html');
    expect(res.status).equal(200);
  });
});

describe(`on POST ${PageUrls.TELEPHONE_NUMBER}`, () => {
  test('should go to update preferences page when phone number has been entered', async () => {
    await request(app)
      .post(PageUrls.TELEPHONE_NUMBER)
      .send({
        telNumber: '01234567890',
      })
      .expect(res => {
        expect(res.status).equal(302);
        expect(res.header['location']).equal(PageUrls.UPDATE_PREFERENCES);
      });
  });
});
