import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.LIP_OR_REPRESENTATIVE}`, () => {
  it('should return the lip or representative page', async () => {
    const res = await request(app).get('/lip-or-representative');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.LIP_OR_REPRESENTATIVE}`, () => {
  test("should return the Single or Multiple claims page when 'representing myself' is selected", async () => {
    await request(app)
      .post(PageUrls.LIP_OR_REPRESENTATIVE)
      .send({ representingMyself: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
      });
  });

  test("should return the legacy ET1 service when the 'making a claim for someone else' option is selected", async () => {
    await request(app)
      .post(PageUrls.LIP_OR_REPRESENTATIVE)
      .send({ representingMyself: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(LegacyUrls.ET1);
      });
  });
});
