import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../main/definitions/definition';
import { mockApp, mockSession } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COMPENSATION}`, () => {
  it('should return the compensation page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COMPENSATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.COMPENSATION}`, () => {
  test(
    'should navigate to claim details check page when ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION or TypesOfClaim.WHISTLE_BLOWING not selected',
    async () => {
      await request(mockApp({}))
        .post(PageUrls.COMPENSATION)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_DETAILS_CHECK);
        });
    }
  );
});
// This case occurs only when both TellUsWhatYouWant.COMPENSATION_ONLY and TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION
// are selected
describe(`on POST ${PageUrls.COMPENSATION}`, () => {
  test(
    'should navigate to PageUrls.TRIBUNAL_RECOMMENDATION when both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION selected',
    async () => {
      await request(
        mockApp({
          session: mockSession(
            [TypesOfClaim.DISCRIMINATION],
            [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
            []
          ),
        })
      )
        .post(PageUrls.COMPENSATION)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.TRIBUNAL_RECOMMENDATION);
        });
    }
  );
});

describe(`on POST ${PageUrls.COMPENSATION}`, () => {
  test(
    'should navigate to PageUrls.WHISTLEBLOWING_CLAIMS when both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TypesOfClaim.WHISTLE_BLOWING selected and TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION not selected',
    async () => {
      await request(
        mockApp({ session: mockSession([TypesOfClaim.WHISTLE_BLOWING], [TellUsWhatYouWant.COMPENSATION_ONLY], []) })
      )
        .post(PageUrls.COMPENSATION)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.WHISTLEBLOWING_CLAIMS);
        });
    }
  );
});
