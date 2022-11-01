import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.VALID_ACAS_REASON}`, () => {
  it('should return the valid no acas reason page', async () => {
    const res = await request(mockApp({})).get(PageUrls.VALID_ACAS_REASON);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.VALID_ACAS_REASON}`, () => {
  test('should return the valid no acas reason page when "correct data is entered" is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.VALID_ACAS_REASON)
      .send({
        validNoAcasReason: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual('/type-of-claim');
      });
  });

  test('should return the valid no acas reason (Welsh language) page when the current language is Welsh and "correct data is entered" is selected', async () => {
    await request(mockApp({}))
      .post(PageUrls.VALID_ACAS_REASON + languages.WELSH_URL_PARAMETER)
      .send({
        validNoAcasReason: YesOrNo.YES,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.TYPE_OF_CLAIM + languages.WELSH_URL_PARAMETER);
      });
  });

  test('should return the valid no acas reason page when "incorrect data is entered"', async () => {
    await request(mockApp({}))
      .post(PageUrls.VALID_ACAS_REASON)
      .send({
        validNoAcasReason: undefined,
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.VALID_ACAS_REASON);
      });
  });
});
