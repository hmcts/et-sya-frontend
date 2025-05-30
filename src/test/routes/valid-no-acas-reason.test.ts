import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.VALID_ACAS_REASON}`, () => {
  it('should return the valid no acas reason page', async () => {
    const res = await request(mockApp({})).get(PageUrls.VALID_ACAS_REASON);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.VALID_ACAS_REASON}`, () => {
  test('should return the valid no acas reason page when "incorrect data is entered"', async () => {
    await request(mockApp({}))
      .post(PageUrls.VALID_ACAS_REASON)
      .send({
        validNoAcasReason: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VALID_ACAS_REASON);
      });
  });
});
