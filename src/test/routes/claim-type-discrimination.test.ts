import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CLAIM_TYPE_DISCRIMINATION}`, () => {
  it('should return the claim type discrimination page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CLAIM_TYPE_DISCRIMINATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CLAIM_TYPE_DISCRIMINATION}`, () => {
  test('should navigate to the claim type pay page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.CLAIM_TYPE_DISCRIMINATION)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_TYPE_PAY);
      });
  });
});
