import request from 'supertest';

import { StillWorking } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.AVERAGE_WEEKLY_HOURS}`, () => {
  it('should return the average weekly hours page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    ).get(PageUrls.AVERAGE_WEEKLY_HOURS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.AVERAGE_WEEKLY_HOURS}`, () => {
  test('should navigate to the pay before tax page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.AVERAGE_WEEKLY_HOURS)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PAY);
      });
  });

  test('should navigate to the pay before tax (Welsh language) page when current language is Welsh and save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.AVERAGE_WEEKLY_HOURS + languages.WELSH_URL_PARAMETER)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PAY + languages.WELSH_URL_PARAMETER);
      });
  });
});
