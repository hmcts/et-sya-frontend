import request from 'supertest';

import { PageUrls } from '../../main/definitions/constants';
import { TellUsWhatYouWant } from '../../main/definitions/definition';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  it('should return the tell us what you want page', async () => {
    const res = await request(mockApp({})).get(PageUrls.TELL_US_WHAT_YOU_WANT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  test(
    'should navigate to the compensation page when TellUsWhatYouWant.COMPENSATION_ONLY selected ' +
      'and save and continue button is clicked',
    async () => {
      await request(mockApp({}))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT)
        .send({ tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY] })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.COMPENSATION);
        });
    }
  );
});

describe(`on POST ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  test(
    'should navigate to the tribunal recommendation page when TellUsWhatYouWant.COMPENSATION_ONLY selected ' +
      'and save and continue button is clicked',
    async () => {
      await request(mockApp({}))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT)
        .send({ tellUsWhatYouWant: [TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION] })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.TRIBUNAL_RECOMMENDATION);
        });
    }
  );
});

describe(`on POST ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  test(
    'should navigate to the compensation page when both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION are selected and save and continue button is clicked',
    async () => {
      await request(mockApp({}))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT)
        .send({ tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION] })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.COMPENSATION);
        });
    }
  );
});
