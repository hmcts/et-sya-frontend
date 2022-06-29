import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.VIDEO_HEARINGS}`, () => {
  it('should return the video hearing choice page', async () => {
    const res = await request(mockApp({})).get('/would-you-want-to-take-part-in-video-hearings');
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.VIDEO_HEARINGS}`, () => {
  test("should return the reasonable adjustments page when 'video' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.VIDEO_HEARINGS)
      .send({ hearingPreference: 'video' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test("should return the reasonable adjustments page when 'phone' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.VIDEO_HEARINGS)
      .send({ hearingPreference: 'phone' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test("should return the reasonable adjustments page when 'no' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.VIDEO_HEARINGS)
      .send({ hearingPreference: 'neither' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });

  test('should reload the page when nothing have been selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.VIDEO_HEARINGS)
      .send({ hearingPreference: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VIDEO_HEARINGS);
      });
  });
});
