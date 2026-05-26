import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH}`, () => {
  it('should return the represented claimant date of birth page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH}`, () => {
  test('should redirect to represented claimant sex and title when date is given', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(mockApp({}))
      .post(PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH)
      .send({
        'representedClaimantDateOfBirth-day': '05',
        'representedClaimantDateOfBirth-month': '11',
        'representedClaimantDateOfBirth-year': '2000',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE);
      });
  });
});
