import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

jest.mock('../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe(`GET ${PageUrls.REPRESENTATIVE_POSTCODE_ENTER}`, () => {
  it('should return the representative postcode enter page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTATIVE_POSTCODE_ENTER);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTATIVE_POSTCODE_ENTER}`, () => {
  it('should redirect to postcode select on a valid postcode', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_POSTCODE_ENTER)
      .send({ representativeEnterPostcode: 'SW1A 1AA' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_POSTCODE_SELECT);
      });
  });

  it('should redirect back on an empty postcode', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_POSTCODE_ENTER)
      .send({ representativeEnterPostcode: '' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_POSTCODE_ENTER);
      });
  });
});

describe(`GET ${PageUrls.REPRESENTATIVE_POSTCODE_SELECT}`, () => {
  it('should return the representative postcode select page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTATIVE_POSTCODE_SELECT);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`GET ${PageUrls.REPRESENTATIVE_ADDRESS_DETAILS}`, () => {
  it('should return the representative address details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTATIVE_ADDRESS_DETAILS}`, () => {
  it('should redirect to phone number page on a valid address', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS)
      .send({
        repAddress1: '1 The Street',
        repAddressTown: 'London',
        repAddressCountry: 'England',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      });
  });

  it('should redirect back when address line 1 is missing', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS)
      .send({ repAddress1: '', repAddressTown: 'London', repAddressCountry: 'England' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS);
      });
  });
});

describe(`GET ${PageUrls.REPRESENTATIVE_PHONE_NUMBER}`, () => {
  it('should return the representative phone number page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTATIVE_PHONE_NUMBER}`, () => {
  it('should redirect to communications preference page on a valid number', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_PHONE_NUMBER)
      .send({ representativePhoneNumber: '07700 900 983' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.UPDATE_PREFERENCES);
      });
  });

  it('should redirect back on an invalid phone number', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_PHONE_NUMBER)
      .send({ representativePhoneNumber: 'not-a-number' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      });
  });
});
