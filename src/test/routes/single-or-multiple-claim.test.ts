import request from 'supertest';

import { app } from '../../main/app';
import { CaseType } from '../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.SINGLE_OR_MULTIPLE_CLAIM}`, () => {
  it('should return the single or multiple claim page', async () => {
    const res = await request(app).get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.SINGLE_OR_MULTIPLE_CLAIM}`, () => {
  test('should go to the multiple respondent check page when single is selected', async () => {
    await request(app)
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.SINGLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ACAS_MULTIPLE_CLAIM);
      });
  });

  test("should return the legacy ET1 service when the 'multiple' option is selected", async () => {
    await request(app)
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.MULTIPLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(LegacyUrls.ET1);
      });
  });
});
