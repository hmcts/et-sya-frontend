import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { StillWorking } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.BENEFITS}`, () => {
  it('should return the benefits page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    ).get(PageUrls.BENEFITS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.BENEFITS}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test('should navigate to the respondent name when either working or notice and save and continue button is clicked', async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE,
        },
      })
    )
      .post(PageUrls.BENEFITS)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.FIRST_RESPONDENT_NAME);
      });
  });

  test('should navigate to the new job page when no longer working and save and continue button is clicked', async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .post(PageUrls.BENEFITS)
      .send({})
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NEW_JOB);
      });
  });
});
