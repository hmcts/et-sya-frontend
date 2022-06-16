import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TRIBUNAL_RECOMMENDATION}`, () => {
  it('should return the tribunal recommendation page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TRIBUNAL_RECOMMENDATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.TRIBUNAL_RECOMMENDATION}`, () => {
  test('should navigate to the whistleblowing claims page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.TRIBUNAL_RECOMMENDATION)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.WHISTLEBLOWING_CLAIMS);
      });
  });
});
