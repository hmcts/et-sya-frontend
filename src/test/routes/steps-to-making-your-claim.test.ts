import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_STEPS}`, () => {
  it('should return the claim steps page', async () => {
    const userCase = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
    const res = await request(mockApp({ userCase })).get(PageUrls.CLAIM_STEPS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });

  it('should return the still working page when unfair dismissal is type of claim', async () => {
    const userCase = { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL] };
    const res = await request(mockApp({ userCase })).get(PageUrls.STILL_WORKING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
