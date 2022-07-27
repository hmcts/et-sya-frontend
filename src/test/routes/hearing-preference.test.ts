import request from 'supertest';

import { HearingPreference } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.HEARING_PREFERENCE}`, () => {
  it('should return the hearing preference page', async () => {
    const res = await request(mockApp({})).get(PageUrls.HEARING_PREFERENCE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.HEARING_PREFERENCE}`, () => {
  test("should return the reasonable adjustments page when 'video' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PREFERENCE)
      .send({ hearing_preferences: HearingPreference.VIDEO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test("should return the reasonable adjustments page when 'phone' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PREFERENCE)
      .send({ hearing_preferences: HearingPreference.PHONE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test("should return the reasonable adjustments page when 'no' and 'save and continue' are selected, and text is entered in the 'no' subfield", async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PREFERENCE)
      .send({ hearing_preferences: HearingPreference.NEITHER, hearing_assistance: 'test' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test("should reload the page when 'no' and 'save and continue' are selected, and the 'no' subfield is left blank", async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PREFERENCE)
      .send({ hearing_preferences: HearingPreference.NEITHER, hearing_assistance: '' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HEARING_PREFERENCE);
      });
  });

  test('should reload the page when nothing has been selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PREFERENCE)
      .send({ hearing_preferences: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HEARING_PREFERENCE);
      });
  });
});
