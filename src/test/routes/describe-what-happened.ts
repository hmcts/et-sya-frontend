import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.DESCRIBE_WHAT_HAPPENED}`, () => {
  it('should return the describe what happened page', async () => {
    const res = await request(mockApp({})).get(PageUrls.DESCRIBE_WHAT_HAPPENED);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.DESCRIBE_WHAT_HAPPENED}`, () => {
  test('should go to the tell us what you want (English language) page when current language is English', async () => {
    await request(mockApp({}))
      .post(PageUrls.DESCRIBE_WHAT_HAPPENED + languages.ENGLISH_URL_PARAMETER)
      .send({ claimSummaryText: 'text' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TELL_US_WHAT_YOU_WANT + languages.ENGLISH_URL_PARAMETER);
      });
  });

  test('should go to the tell us what you want (Welsh language) page when current language is Welsh', async () => {
    await request(mockApp({}))
      .post(PageUrls.DESCRIBE_WHAT_HAPPENED + languages.WELSH_URL_PARAMETER)
      .send({ claimSummaryText: 'text' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TELL_US_WHAT_YOU_WANT + languages.WELSH_URL_PARAMETER);
      });
  });
});
