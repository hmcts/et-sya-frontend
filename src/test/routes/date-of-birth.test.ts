import request from 'supertest';

import { app } from '../../main/app';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.DOB_DETAILS}`, () => {
  it('should return the date of birth page', async () => {
    const res = await request(app).get(PageUrls.DOB_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.DOB_DETAILS}`, () => {
  test('should go to the Gender details page when correct date is entered', async () => {
    await request(app)
      .post(PageUrls.DOB_DETAILS)
      .send({
        'dobDate-year': '2000',
        'dobDate-month': '12',
        'dobDate-day': '24',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.GENDER_DETAILS);
      });
  });
});
