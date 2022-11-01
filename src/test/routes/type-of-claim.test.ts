import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TYPE_OF_CLAIM}`, () => {
  it('should return the type of claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TYPE_OF_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.TYPE_OF_CLAIM}`, () => {
  test('should return the type of claim page when case types discrimination or whistle blowing is not selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.TYPE_OF_CLAIM)
      .send({
        typeOfClaim: [],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TYPE_OF_CLAIM);
      });
  });

  test('should return the type of claim (Welsh language) page when the current language is Welsh and case types discrimination or whistle blowing is not selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.TYPE_OF_CLAIM + languages.WELSH_URL_PARAMETER)
      .send({
        typeOfClaim: [],
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TYPE_OF_CLAIM + languages.WELSH_URL_PARAMETER);
      });
  });
});
