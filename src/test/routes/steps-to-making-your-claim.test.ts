import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { TypesOfClaim } from '../../main/definitions/definition';
import { mockApp } from '../unit/mocks/mockApp';

// There is no routing in this page that is why the only test is being able to get the page itself without any error.
// Page has links which are tested on the view tests
describe(`GET ${PageUrls.CLAIM_STEPS}`, () => {
  it('should return httpOK code(200) when page is requested', async () => {
    const userCase = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
    const res = await request(mockApp({ userCase })).get(PageUrls.CLAIM_STEPS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.statusCode).toStrictEqual(200);
  });
});
