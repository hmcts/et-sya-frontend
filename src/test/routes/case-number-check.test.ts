import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.CASE_NUMBER_CHECK}`, () => {
  it('should go to the case number check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CASE_NUMBER_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.CASE_NUMBER_CHECK}`, () => {
  test('should redirect when valid case number is provided', async () => {
    await request(app)
      .post(PageUrls.CASE_NUMBER_CHECK)
      .send({ ethosCaseReference: '1234567/2023' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toContain('/');
      });
  });

  test('should redirect back to same page when case number is empty', async () => {
    await request(app)
      .post(PageUrls.CASE_NUMBER_CHECK)
      .send({ ethosCaseReference: '' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CASE_NUMBER_CHECK);
      });
  });
});
