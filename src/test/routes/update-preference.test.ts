import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.UPDATE_PREFERENCES}`, () => {
  it('should return the how would you like to be updated about your claim page', async () => {
    const res = await request(app).get(PageUrls.UPDATE_PREFERENCES);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.UPDATE_PREFERENCES}`, () => {
  test('should go to the video hearing page when the Email radio button is selected', async () => {
    await request(app)
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ updatePreference: 'Email' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
      });
  });

  test('should go to the video hearing page when the Post radio button is selected', async () => {
    await request(app)
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ updatePreference: 'Post' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
      });
  });

  test('should reload the page when the no radio button is selected', async () => {
    await request(app)
      .post(PageUrls.UPDATE_PREFERENCES)
      .send({ updatePreference: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
      });
  });
});
