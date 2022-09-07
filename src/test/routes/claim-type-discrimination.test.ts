import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';
import { mockApp, mockSession } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_TYPE_DISCRIMINATION}`, () => {
  it('should return the claim type discrimination page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_TYPE_DISCRIMINATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CLAIM_TYPE_DISCRIMINATION}`, () => {
  test('should navigate to the describe what happened page when TypesOfClaim.PAY_RELATED_CLAIM not selected', async () => {
    await request(mockApp({ session: mockSession([TypesOfClaim.DISCRIMINATION], [], []) }))
      .post(PageUrls.CLAIM_TYPE_DISCRIMINATION)
      .send({ claimTypeDiscrimination: ['age'] })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.DESCRIBE_WHAT_HAPPENED.toString());
      });
  });
});
// This case occurs only when TypesOfClaim.WHISTLE_BLOWING and TypesOfClaim.PAY_RELATED_CLAIM are selected
describe(`on POST ${PageUrls.CLAIM_TYPE_DISCRIMINATION}`, () => {
  test('should navigate to the claim type pay when TypesOfClaim.PAY_RELATED_CLAIM selected', async () => {
    await request(
      mockApp({ session: mockSession([TypesOfClaim.WHISTLE_BLOWING, TypesOfClaim.PAY_RELATED_CLAIM], [], []) })
    )
      .post(PageUrls.CLAIM_TYPE_DISCRIMINATION)
      .send({ claimTypeDiscrimination: ['age'] })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_TYPE_PAY.toString());
      });
  });
});
