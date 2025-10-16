import request from 'supertest';

import { CaseDataCacheKey, CaseType, YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';
import { mockAppWithRedisClient, mockRedisClient, mockSession } from '../unit/mocks/mockApp';

// There is no routing in this page, that is why the only test is being able to get the page itself without any error.
// Page has links which are tested on the view tests
describe(`GET ${PageUrls.CLAIM_STEPS}`, () => {
  it('should return httpOK code(200) when page is requested', async () => {
    const res = await request(
      mockAppWithRedisClient({
        session: mockSession([], [], []),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.WHISTLE_BLOWING])],
          ])
        ),
      })
    ).get(PageUrls.CLAIM_STEPS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
