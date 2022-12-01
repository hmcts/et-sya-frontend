import { expect } from 'chai';
import request from 'supertest';

import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.SELECTED_APPLICATION + '/newClaim' + languages.ENGLISH_URL_PARAMETER}`, () => {
  it('should return to home page in English language if new claim and current language is English', async () => {
    const res = await request(mockApp({})).get('/claimant-application/newClaim?lng=en');
    expect(res.header['location']).equal(PageUrls.WORK_POSTCODE + languages.ENGLISH_URL_PARAMETER);
  });
});

describe(`GET ${PageUrls.SELECTED_APPLICATION + '/newClaim' + languages.WELSH_URL_PARAMETER}`, () => {
  it('should return to home page in Welsh language if new claim and current language is Welsh', async () => {
    const res = await request(mockApp({})).get('/claimant-application/newClaim?lng=cy');
    expect(res.header['location']).equal(PageUrls.WORK_POSTCODE + languages.WELSH_URL_PARAMETER);
  });
});
