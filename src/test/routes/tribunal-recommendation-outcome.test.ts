import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME}`, () => {
  it('should return the summarise your claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME}`, () => {
  test('should go to the desired claim outcome page', async () => {
    await request(mockApp({}))
      .post(PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PCQ);
      });
  });
});
