import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.UPDATE_PREFERENCES}`, () => {
  it('should return the how would you like to be updated about your claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.UPDATE_PREFERENCES);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.UPDATE_PREFERENCES}`, () => {
  test('should go to the video hearing page when the Email radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ claimantContactPreference: 'Email' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
      });
  });

  test('should go to the video hearing (Welsh language) page when the current language is Welsh and the Email radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.UPDATE_PREFERENCES + languages.WELSH_URL_PARAMETER)
      .send({ claimantContactPreference: 'Email' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS + languages.WELSH_URL_PARAMETER);
      });
  });

  test('should go to the video hearing page when the Post radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ claimantContactPreference: 'Post' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
      });
  });

  test('should reload the page when the no radio button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ claimantContactPreference: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
      });
  });
});
