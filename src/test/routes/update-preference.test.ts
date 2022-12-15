import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.UPDATE_PREFERENCES}`, () => {
  it('should return the how would you like to be updated about your claim page', async () => {
    const res = await request(mockApp({})).get(PageUrls.UPDATE_PREFERENCES);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.UPDATE_PREFERENCES}`, () => {
  describe('Correct input', () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    test('goes to next page when selecting just Email radio button', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({ claimantContactPreference: 'Email' })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
        });
    });

    test('goes to next page when selecting just Post radio button', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({ claimantContactPreference: 'Post' })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
        });
    });

    test('goes to next page when selecting English radio button', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({
          claimantContactPreference: 'Email',
          claimantContactLanguagePreference: 'English',
          claimantHearingLanguagePreference: 'English',
        })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
        });
    });

    test('goes to next page when selecting Welsh radio button', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({
          claimantContactPreference: 'Email',
          claimantContactLanguagePreference: 'Welsh',
          claimantHearingLanguagePreference: 'Welsh',
        })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
        });
    });
  });

  describe('require contact preference', () => {
    test("should reload the page when the just contact preference isn't selected", async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({
          claimantContactLanguagePreference: 'English',
          claimantHearingLanguagePreference: 'English',
        })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
        });
    });

    test('should reload the page when the no radio button is selected', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({})
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
        });
    });

    test('should reload the page when the no Language radio button is selected', async () => {
      await request(mockApp({}))
        .post(PageUrls.UPDATE_PREFERENCES)
        .send({ claimantContactPreference: undefined })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
        });
    });
  });
});
