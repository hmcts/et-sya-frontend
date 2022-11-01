import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.PERSONAL_DETAILS_CHECK}`, () => {
  it('should return the task list check page', async () => {
    const res = await request(mockApp({})).get(PageUrls.PERSONAL_DETAILS_CHECK);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.PERSONAL_DETAILS_CHECK}`, () => {
  test('should go to the claim steps page', async () => {
    await request(mockApp({}))
      .post(PageUrls.PERSONAL_DETAILS_CHECK)
      .send({ personalDetailsCheck: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS);
      });
  });

  test('should go to the claim steps (Welsh language) page when the current language is Welsh', async () => {
    await request(mockApp({}))
      .post(PageUrls.PERSONAL_DETAILS_CHECK + languages.WELSH_URL_PARAMETER)
      .send({ personalDetailsCheck: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER);
      });
  });
});
