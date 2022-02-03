import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import { URLS } from '../../main/definitions/constants';

describe('GET /single-or-multiple-claim', () => {
  it('should return the single or multiple claim page', async () => {
    const res = await request(app).get('/single-or-multiple-claim');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /single-or-multiple-claim', () => {
  test('should return the next page when single is selected', async () => {
    await request(app)
      .post('/single-or-multiple-claim')
      .send({'single-or-multiple': 'single'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/do-you-have-an-acas-single-resps');
      });
  });
});

describe('on POST /single-or-multiple-claim', () => {
  test('should return the legacy ET1 service when the \'mutliple\' option is selected', async () => {
    await request(app)
      .post('/single-or-multiple-claim')
      .send({'single-or-multiple': 'multiple'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal(URLS.LEGACY_ET1);
      });
  });
});
