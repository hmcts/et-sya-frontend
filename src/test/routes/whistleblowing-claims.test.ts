import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.WHISTLEBLOWING_CLAIMS}`, () => {
  it('should return the whistleblowing claims page', async () => {
    const res = await request(mockApp({})).get(PageUrls.WHISTLEBLOWING_CLAIMS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.WHISTLEBLOWING_CLAIMS}`, () => {
  test('should navigate to the claim details check page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.WHISTLEBLOWING_CLAIMS)
      .send({ whistleblowingClaim: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_DETAILS_CHECK);
      });
  });
});
