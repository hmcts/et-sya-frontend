import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SUMMARISE_YOUR_CLAIM}`, () => {
  it('should return the summarise your claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.SUMMARISE_YOUR_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.SUMMARISE_YOUR_CLAIM}`, () => {
  test('should go to the desired claim outcome page', async () => {
    await request(mockApp({}))
      .post(PageUrls.SUMMARISE_YOUR_CLAIM)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.DESIRED_CLAIM_OUTCOME);
      });
  });
});
