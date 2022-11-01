import request from 'supertest';

import { Sex } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SEX_AND_TITLE}`, () => {
  it('should return the gender details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.SEX_AND_TITLE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.SEX_AND_TITLE}`, () => {
  test('should go to the address details page', async () => {
    await request(mockApp({}))
      .post(PageUrls.SEX_AND_TITLE)
      .send({ claimantSex: Sex.MALE, preferredTitle: 'Mr' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADDRESS_DETAILS);
      });
  });

  test('should go to the address details (Welsh language) page when the current language is Welsh', async () => {
    await request(mockApp({}))
      .post(PageUrls.SEX_AND_TITLE + languages.WELSH_URL_PARAMETER)
      .send({ claimantSex: Sex.MALE, preferredTitle: 'Mr' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADDRESS_DETAILS + languages.WELSH_URL_PARAMETER);
      });
  });
});

describe(`POST ${PageUrls.SEX_AND_TITLE}`, () => {
  test('should return gender details page if title contains number', async () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: '7',
    };
    await request(mockApp({ body }))
      .post(PageUrls.SEX_AND_TITLE)
      .expect(res => {
        expect(res.header['location']).toStrictEqual(PageUrls.SEX_AND_TITLE);
      });
  });
});
