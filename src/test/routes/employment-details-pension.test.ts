import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.EMPLOYMENT_DETAILS_PENSION}`, () => {
  it('should return the employment details notice pension page', async () => {
    const res = await request(app).get(PageUrls.EMPLOYMENT_DETAILS_PENSION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

// TODO: Change to the correct redirect url for clicking 'save and continue' button
// YES, NO or no response - '/employment-details-notice-benefits' RET-1059
describe(`on POST ${PageUrls.EMPLOYMENT_DETAILS_PENSION}`, () => {
  test("should return the home page when 'yes' and 'save and continue' are selected", async () => {
    await request(app)
      .post(PageUrls.EMPLOYMENT_DETAILS_PENSION)
      .send({ employmentDetailsPension: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HOME);
      });
  });

  test("should return the home page when 'no' and 'save and continue' are selected", async () => {
    await request(app)
      .post(PageUrls.EMPLOYMENT_DETAILS_PENSION)
      .send({
        employmentDetailsPension: YesOrNo.NO,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HOME);
      });
  });

  test('should return the home page when no radio buttons are selected', async () => {
    await request(app)
      .post(PageUrls.EMPLOYMENT_DETAILS_PENSION)
      .send({ employmentDetailsPension: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.HOME);
      });
  });
});
