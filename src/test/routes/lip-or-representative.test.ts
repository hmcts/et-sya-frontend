import { expect } from 'chai';
import { YesOrNo } from 'definitions/case';
import request from 'supertest';

import { app } from '../../main/app';
import { LEGACY_URLS  } from '../../main/definitions/constants';


describe('GET /lip-or-representative', () => {
  it('should return the lip or representative page', async () => {
    const res = await request(app).get('/lip-or-representative');
    expect(res.type).to.equal('text/html');
    expect(res.status).to.equal(200);
  });
});

describe('on POST /lip-or-representative', () => {
  test('should return the Single or Multiple claims page when \'representing myself\' is selected', async () => {
    await request(app)
      .post('/lip-or-representative')
      .send({ representingMyself: YesOrNo.YES })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/single-or-multiple-claim');
      });
  });
});

describe('on POST /lip-or-representative', () => {
  test('should return the legacy ET1 service when the \'making a claim for someone else\' option is selected', async () => {
    await request(app)
      .post('/lip-or-representative')
      .send({ representingMyself: YesOrNo.NO })
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal(LEGACY_URLS.ET1);
      });
  });
});