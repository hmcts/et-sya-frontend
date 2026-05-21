import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { AddAdditionalClaimant } from '../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.ADD_ANOTHER_CLAIMANT}`, () => {
  it('should return the add another claimant page', async () => {
    const res = await request(mockApp({})).get(PageUrls.ADD_ANOTHER_CLAIMANT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ADD_ANOTHER_CLAIMANT}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

  test('should redirect back to additional claimant personal details page when manual is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: AddAdditionalClaimant.MANUAL })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
      });
  });

  test('should redirect back to # page when spreadsheet is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: AddAdditionalClaimant.SPREADSHEET })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(ErrorPages.NOT_FOUND);
      });
  });

  test('should return the add another claimant page when no option is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.ADD_ANOTHER_CLAIMANT)
      .send({ addClaimantMethod: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADD_ANOTHER_CLAIMANT);
      });
  });
});
