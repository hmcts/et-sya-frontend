import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.PREPARE_DOCUMENTS}`, () => {
  it('should return the prepare documents page', async () => {
    const res = await request(mockApp({})).get(PageUrls.PREPARE_DOCUMENTS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PREPARE_DOCUMENTS}`, () => {
  test('should navigate to the agreeing documents page when continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
      });
  });
});
