import request from 'supertest';

import { StillWorking } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.PAY}`, () => {
  it('should return the pay before tax page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    ).get(PageUrls.PAY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PAY}`, () => {
  test('should navigate to the pay after tax page when save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.PAY)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PENSION);
      });
  });

  test('should navigate to the pay after tax (Welsh language) page when the current language is Welsh and save and continue button is clicked', async () => {
    await request(mockApp({}))
      .post(PageUrls.PAY + languages.WELSH_URL_PARAMETER)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PENSION + languages.WELSH_URL_PARAMETER);
      });
  });
});
