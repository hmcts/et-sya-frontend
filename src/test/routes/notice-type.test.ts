import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_TYPE}`, () => {
  it('should return the notice type page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NOTICE_TYPE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_TYPE}`, () => {
  test('should navigate to the notice length page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.NOTICE_TYPE)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_LENGTH);
      });
  });
});
