import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
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
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test('should redirect to group claims check when single is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.SINGLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.GROUP_CLAIMS_CHECK);
      });
  });

  test('should redirect to add another when multiple is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.MULTIPLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADD_ANOTHER_CLAIMANT);
      });
  });

  test('should redirect to review additional claimants when there are additional claimants and multiple is selected', async () => {
    await request(
      mockApp({
        userCase: {
          additionalClaimants: [
            {
              firstName: 'John',
              lastName: 'Doe',
            },
          ],
        },
      })
    )
      .post(PageUrls.SINGLE_OR_MULTIPLE_CLAIM)
      .send({ caseType: CaseType.MULTIPLE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
      });
  });
});
