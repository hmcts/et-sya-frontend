import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_DETAILS_CHECK}`, () => {
  it('should return the claim details check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_DETAILS_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CLAIM_DETAILS_CHECK}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve(true));
  test('should navigate to the claim steps page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.CLAIM_DETAILS_CHECK)
      .send({ claimDetailsCheck: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });
});
