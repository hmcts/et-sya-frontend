import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/respondent/1/place-of-work';

jest.mock('node-fetch', () => jest.fn());

describe(`GET ${PageUrls.PLACE_OF_WORK}`, () => {
  it('should go to place of work page', async () => {
    const res = await request(mockApp({})).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.PLACE_OF_WORK}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve(true));
  test('should redirect to acas number page on submit', async () => {
    await request(mockApp({}))
      .post(pageUrl)
      .send({
        workAddress1: '31 The Street',
        workAddress2: '',
        workAddressTown: 'Exeter',
        workAddressCountry: 'United Kingdom',
        workAddressPostcode: 'EX7 8KK',
      })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/respondent/1/acas-cert-num');
      });
  });
});
