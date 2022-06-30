import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_END}`, () => {
  it('should return the notice end page', async () => {
    const res = await request(mockApp({})).get(PageUrls.NOTICE_END);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_END}`, () => {
  test('should navigate to the notice type page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.NOTICE_END)
      .send({ 'noticeEnds-day': '10', 'noticeEnds-month': '10', 'noticeEnds-year': '2023' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NOTICE_TYPE);
      });
  });
});
