import request from 'supertest';

import { app } from '../../main/app';
import { StillWorking } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.PAY_AFTER_TAX}`, () => {
  it('should return the pay after tax page when Still Working has been selected', async () => {
    const res = await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING,
        },
      })
    ).get(PageUrls.PAY_AFTER_TAX);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PAY_AFTER_TAX}`, () => {
  test('should navigate to the pension page when save and continue button is clicked', async () => {
    await request(app)
      .post(PageUrls.PAY_AFTER_TAX)
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.PENSION);
      });
  });
});
