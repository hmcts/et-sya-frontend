import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK}`, () => {
  it('should return the represented claimant details check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

  test('should redirect to claim steps when mandatory represented claimant fields exist without optional fields', async () => {
    const app = mockApp({
      userCase: {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '1 High Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'United Kingdom',
        representedClaimantEmail: 'jane.doe@example.com',
        claimantSex: undefined,
        preferredTitle: undefined,
        representedClaimantDateOfBirth: undefined,
      },
    });

    await request(app)
      .post(PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK)
      .send({ representedClaimantDetailsCheck: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS_NON_HMCTS);
      });
  });
});
