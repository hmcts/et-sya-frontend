import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { LegacyUrls } from '../../main/definitions/constants';

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
      .send({ isASingleClaim: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(LegacyUrls.ET1);
      });
  });
});
