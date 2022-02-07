import request from 'supertest';

import { app } from '../../main/app';
<<<<<<< HEAD
import { LEGACY_URLS  } from '../../main/definitions/constants';
=======
import { YesOrNo } from '../../main/definitions/case';
import { LEGACY_URLS } from '../../main/definitions/constants';
>>>>>>> origin/master

describe('GET /single-or-multiple-claim', () => {
  it('should return the single or multiple claim page', async () => {
    const res = await request(app).get('/single-or-multiple-claim');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe('on POST /single-or-multiple-claim', () => {
  test('should return the next page when single is selected', async () => {
    await request(app)
      .post('/single-or-multiple-claim')
      .send({ isASingleClaim: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        // page to be implemented, this test will need updated
        expect(res.header['location']).toStrictEqual('/');
      });
  });

  test("should return the legacy ET1 service when the 'mutliple' option is selected", async () => {
    await request(app)
      .post('/single-or-multiple-claim')
<<<<<<< HEAD
      .send({'single-or-multiple': 'multiple'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal(LEGACY_URLS.ET1);
=======
      .send({ isASingleClaim: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(LEGACY_URLS.ET1);
>>>>>>> origin/master
      });
  });
});
