import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.BENEFITS}`, () => {
  it('should return the benefits page', async () => {
    const res = await request(mockApp({})).get(PageUrls.BENEFITS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
// TODO change url from Home to Where do you work?
describe(`on POST ${PageUrls.BENEFITS}`, () => {
  test('should navigate to the home page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.BENEFITS)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HOME);
      });
  });
});
