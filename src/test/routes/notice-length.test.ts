import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { StillWorking, WeeksOrMonths } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.NOTICE_LENGTH}`, () => {
  it('should return the notice length page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          noticePeriodUnit: WeeksOrMonths.WEEKS || WeeksOrMonths.MONTHS,
        },
      })
    ).get(PageUrls.NOTICE_LENGTH);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.NOTICE_LENGTH}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
  test('should navigate to the average weekly hours page when a valid notice length is entered and save and continue button is clicked', async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .post(PageUrls.NOTICE_LENGTH)
      .send({
        noticePeriodLength: '2',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.AVERAGE_WEEKLY_HOURS);
      });
  });
});
