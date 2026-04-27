import request from 'supertest';

import { CaseType } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SINGLE_OR_MULTIPLE_CLAIM}`, () => {
  it('should return the single or multiple claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.SINGLE_OR_MULTIPLE_CLAIM}`, () => {
  test('should go to the multiple respondent check page when single is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.SINGLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_JURISDICTION_SELECTION);
      });
  });

  test("should return the legacy ET1 service when the 'multiple' option is selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.MULTIPLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(
          'https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number'
        );
      });
  });
});
