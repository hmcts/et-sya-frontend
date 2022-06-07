import request from 'supertest';

import { StillWorking } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.STILL_WORKING}`, () => {
  it('should return the are you still working page page', async () => {
    const res = await request(mockApp({})).get(PageUrls.STILL_WORKING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.STILL_WORKING}`, () => {
  test('should return the employment details - job title page when Still working for them button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.STILL_WORKING)
      .send({ isStillWorking: StillWorking.WORKING })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.JOB_TITLE);
      });
  });
  test('should return the employment details - job title page when notice period button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.STILL_WORKING)
      .send({ isStillWorking: StillWorking.NOTICE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.JOB_TITLE);
      });
  });
  test('should return the employment details - job title page when no longer working button is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.STILL_WORKING)
      .send({ isStillWorking: StillWorking.NOTICE })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.JOB_TITLE);
      });
  });
});
