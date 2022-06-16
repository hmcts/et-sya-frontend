import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.COMPENSATION}`, () => {
  it('should return the compensation page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COMPENSATION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.COMPENSATION}`, () => {
  test('should navigate to the tribunal recommendation page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.COMPENSATION)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TRIBUNAL_RECOMMENDATION);
      });
  });
});
