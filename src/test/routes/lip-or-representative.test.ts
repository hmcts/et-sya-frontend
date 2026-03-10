import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.LIP_OR_REPRESENTATIVE}`, () => {
  it('should return the lip or representative page', async () => {
    const res = await request(mockApp({})).get('/lip-or-representative');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.LIP_OR_REPRESENTATIVE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test("should return the Single or Multiple claims page when (no) 'representing myself' is selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.LIP_OR_REPRESENTATIVE)
      .send({ claimantRepresentedQuestion: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
      });
  });

  test("should return the legacy ET1 service when (yes) the 'making a claim for someone else' option is selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.LIP_OR_REPRESENTATIVE)
      .send({ claimantRepresentedQuestion: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(
          'https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number'
        );
      });
  });
});
