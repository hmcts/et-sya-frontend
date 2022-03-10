import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.PENSION}`, () => {
  it('should return the employment details notice pension page', async () => {
    const res = await request(app).get(PageUrls.PENSION);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PENSION}`, () => {
  test("should return the benefits page when 'yes' and 'save and continue' are selected", async () => {
    await request(app)
      .post(PageUrls.PENSION)
      .send({ pension: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.BENEFITS);
      });
  });

  test("should return the benefits page when 'no' and 'save and continue' are selected", async () => {
    await request(app)
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
    await request(app)
      .post(PageUrls.PENSION)
      .send({ employmentDetailsPension: undefined })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.BENEFITS);
      });
  });
});
