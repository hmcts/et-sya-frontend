import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_PAY}`, () => {
  it('should return the notice pay page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NOTICE_PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_PAY}`, () => {
  test('should navigate to the average weekly hours page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.NOTICE_PAY)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.AVERAGE_WEEKLY_HOURS);
      });
  });
});
