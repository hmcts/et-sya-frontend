import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';
import { mockApp, mockSession } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TRIBUNAL_RECOMMENDATION}`, () => {
  it('should return the tribunal recommendation page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TRIBUNAL_RECOMMENDATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.TRIBUNAL_RECOMMENDATION}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test(
    'should navigate to PageUrls.CLAIM_DETAILS_CHECK when TypesOfClaim.WHISTLE_BLOWING is not selected and ' +
      'save and continue button is clicked',
    async () => {
      await request(mockApp({ session: mockSession([], [], []) }))
        .post(PageUrls.TRIBUNAL_RECOMMENDATION)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_DETAILS_CHECK);
        });
    }
  );
  test(
    'should navigate to the whistleblowing claims page when TypesOfClaim.WHISTLE_BLOWING is selected and ' +
      'save and continue button is clicked',
    async () => {
      await request(mockApp({ session: mockSession([TypesOfClaim.WHISTLE_BLOWING], [], []) }))
        .post(PageUrls.TRIBUNAL_RECOMMENDATION)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.WHISTLEBLOWING_CLAIMS);
        });
    }
  );
});
