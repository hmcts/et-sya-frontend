import request from 'supertest';

import { app } from '../../main/app';
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
  test('should navigate to the new job page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.BENEFITS)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NEW_JOB);
      });
  });
});
