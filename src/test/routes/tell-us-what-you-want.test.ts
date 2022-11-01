import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../main/definitions/definition';
import { mockApp, mockSession } from '../unit/mocks/mockApp';

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
    'should navigate to the tribunal recommendation page when TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION selected ' +
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

describe(`on POST ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  test(
    'should navigate to the whistle blowing claims page when both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION are not selected, TypesOfClaim.WHISTLE_BLOWING selected ' +
      'and save and continue button is clicked',
    async () => {
      await request(mockApp({ session: mockSession([TypesOfClaim.WHISTLE_BLOWING], [], []) }))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.WHISTLEBLOWING_CLAIMS);
        });
    }
  );

  test(
    'should navigate to the whistle blowing claims (Welsh language) page when the current language is Welsh, both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION are not selected, TypesOfClaim.WHISTLE_BLOWING selected ' +
      'and save and continue button is clicked',
    async () => {
      await request(mockApp({ session: mockSession([TypesOfClaim.WHISTLE_BLOWING], [], []) }))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT + languages.WELSH_URL_PARAMETER)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.WHISTLEBLOWING_CLAIMS + languages.WELSH_URL_PARAMETER);
        });
    }
  );
});

describe(`on POST ${PageUrls.TELL_US_WHAT_YOU_WANT}`, () => {
  test(
    'should navigate to the PageUrls.CLAIM_DETAILS_CHECK page when both TellUsWhatYouWant.COMPENSATION_ONLY and ' +
      'TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION are not selected, TypesOfClaim.WHISTLE_BLOWING is not selected ' +
      'and save and continue button is clicked',
    async () => {
      await request(mockApp({ session: mockSession([], [], []) }))
        .post(PageUrls.TELL_US_WHAT_YOU_WANT)
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.CLAIM_DETAILS_CHECK);
        });
    }
  );
});
