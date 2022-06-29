import request from 'supertest';

import { StillWorking, YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.PENSION}`, () => {
  it('should return the employment details notice pension page', async () => {
    const res = await request(mockApp({})).get(PageUrls.PENSION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PENSION}`, () => {
  test("should return the benefits page when 'yes' radio button is selected, a valid pension contribution is entered and 'save and continue' are selected", async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .post(PageUrls.PENSION)
      .send({
        pension: YesOrNo.YES,
        pensionContributions: '100',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.BENEFITS);
      });
  });

  test("should return the benefits page when 'no' and 'save and continue' are selected", async () => {
    await request(mockApp({}))
      .post(PageUrls.PENSION)
      .send({
        pension: YesOrNo.NO,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.BENEFITS);
      });
  });

  test('should return the benefits page when no radio buttons are selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.PENSION)
      .send({ employmentDetailsPension: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.BENEFITS);
      });
  });
});
