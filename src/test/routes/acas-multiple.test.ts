import request from 'supertest';

import { app } from '../../main/app';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';

describe(`GET ${PageUrls.ACAS_MULTIPLE_CLAIM}`, () => {
  it('should return the do you have an Acas certificate page', async () => {
    const res = await request(app).get(PageUrls.ACAS_MULTIPLE_CLAIM);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.ACAS_MULTIPLE_CLAIM}`, () => {
  test('should go to the types of claim page when the Yes radio button is selected', async () => {
    await request(app)
      .post(PageUrls.ACAS_MULTIPLE_CLAIM)
      .send({ acasMultiple: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TYPE_OF_CLAIM);
      });
  });

  test('should go to the no valid acas page when the No radio button is selected', async () => {
    await request(app)
      .post(PageUrls.ACAS_MULTIPLE_CLAIM)
      .send({ acasMultiple: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.NO_ACAS_NUMBER);
      });
  });

  test('should return the acas multiple claim page when "incorrect data is entered"', async () => {
    await request(app)
      .post(PageUrls.ACAS_MULTIPLE_CLAIM)
      .send({
        acasMultiple: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ACAS_MULTIPLE_CLAIM);
      });
  });
});
