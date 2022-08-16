import request from 'supertest';

import { Sex } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.GENDER_DETAILS}`, () => {
  it('should return the gender details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.GENDER_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.GENDER_DETAILS}`, () => {
  test('should go to the address details page', async () => {
    await request(mockApp({}))
      .post(PageUrls.GENDER_DETAILS)
      .send({ claimantSex: Sex.MALE, preferredTitle: 'Mr' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.ADDRESS_DETAILS);
      });
  });
});

describe(`POST ${PageUrls.GENDER_DETAILS}`, () => {
  test('should return gender details page if other title preference contains number', async () => {
    const body = {
      claimantSex: Sex.MALE,
      claimantGenderIdentitySame: 'YesOrNoOrPreferNot.YES',
      preferredTitle: 'Other',
      otherTitlePreference: '7',
    };
    await request(mockApp({ body }))
      .post(PageUrls.GENDER_DETAILS)
      .expect(res => {
        expect(res.header['location']).toStrictEqual(PageUrls.GENDER_DETAILS);
      });
  });
});

describe(`POST ${PageUrls.GENDER_DETAILS}`, () => {
  test('should return gender details page if other title preference is blank', async () => {
    const body = {
      claimantSex: Sex.MALE,
      claimantGenderIdentitySame: 'YesOrNoOrPreferNot.YES',
      preferredTitle: 'Other',
      otherTitlePreference: ' ',
    };
    await request(mockApp({ body }))
      .post(PageUrls.GENDER_DETAILS)
      .expect(res => {
        expect(res.header['location']).toStrictEqual(PageUrls.GENDER_DETAILS);
      });
  });
});
