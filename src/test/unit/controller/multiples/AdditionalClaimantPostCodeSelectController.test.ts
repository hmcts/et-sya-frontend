import { getAddressesForPostcode } from '../../../../main/address';
import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import AdditionalClaimantPostCodeSelectController from '../../../../main/controllers/multiples/AdditionalClaimantPostCodeSelectController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('../../../../main/address', () => ({
  getAddressesForPostcode: jest.fn(),
}));

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('AdditionalClaimantPostCodeSelectController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set validation errors and redirect back when invalid data is posted', async () => {
    const req = mockRequest({ body: {} });
    const res = mockResponse();
    req.url = PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT;

    await new AdditionalClaimantPostCodeSelectController().post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(req.session.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ propertyName: 'additionalClaimantAddress1', errorType: 'required' }),
        expect.objectContaining({ propertyName: 'additionalClaimantAddressTown', errorType: 'required' }),
        expect.objectContaining({ propertyName: 'additionalClaimantAddressCountry', errorType: 'required' }),
      ])
    );
    expect(CaseHelper.handleUpdateDraftCase).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT);
  });

  it('should update existing claimant address and redirect to review page', async () => {
    const req = mockRequest({
      body: {
        additionalClaimantAddressTypes: '0',
        additionalClaimantAddress1: '17, Pantyblawd Road',
        additionalClaimantAddress2: 'Llansamlet',
        additionalClaimantAddressTown: 'Abertawe',
        additionalClaimantAddressCountry: 'Wales',
        additionalClaimantAddressPostcode: 'SA7 9RN',
      },
    });
    const res = mockResponse();
    req.session.userCase.currentAdditionalClaimantIndex = 0;
    req.session.userCase.additionalClaimants = [
      {
        title: 'Mrs',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      },
    ];
    req.session.userCase.additionalClaimantAddresses = [
      {
        street1: '17, Pantyblawd Road',
        street2: 'Llansamlet',
        town: 'Abertawe',
        country: 'Wales',
        postcode: 'SA7 9RN',
      },
    ];

    await new AdditionalClaimantPostCodeSelectController().post(req, res);

    expect(req.session.userCase.additionalClaimants[0].address.AddressLine1).toBe('17, Pantyblawd Road');
    expect(req.session.userCase.additionalClaimants[0].address.AddressLine2).toBe('Llansamlet');
    expect(req.session.userCase.additionalClaimants[0].address.PostTown).toBe('Abertawe');
    expect(req.session.userCase.additionalClaimants[0].address.Country).toBe('Wales');
    expect(req.session.userCase.additionalClaimants[0].address.PostCode).toBe('SA7 9RN');
    expect(req.session.userCase.currentAdditionalClaimantIndex).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddress2).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressTown).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressCountry).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressPostcode).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressTypes).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddresses).toBeUndefined();
    expect(CaseHelper.handleUpdateDraftCase).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
  });

  it('should create claimant if needed and redirect to claim saved when saveForLater is posted', async () => {
    const req = mockRequest({
      body: {
        additionalClaimantAddressTypes: '0',
        additionalClaimantAddress1: '1 New Street',
        additionalClaimantAddressTown: 'Manchester',
        additionalClaimantAddressCountry: 'England',
        additionalClaimantAddressPostcode: 'M1 1AA',
        saveForLater: true,
      },
    });
    const res = mockResponse();
    req.session.userCase.additionalClaimants = [];
    req.session.userCase.additionalClaimantTitle = 'Mr';
    req.session.userCase.additionalClaimantFirstName = 'John';
    req.session.userCase.additionalClaimantLastName = 'Smith';
    req.session.userCase.additionalClaimantEmail = 'john.smith@example.com';
    req.session.userCase.additionalClaimantAddresses = [
      {
        street1: '1 New Street',
        street2: '',
        town: 'Manchester',
        country: 'England',
        postcode: 'M1 1AA',
      },
    ];

    await new AdditionalClaimantPostCodeSelectController().post(req, res);

    expect(req.session.userCase.additionalClaimants).toHaveLength(1);
    expect(req.session.userCase.additionalClaimants[0].firstName).toBe('John');
    expect(req.session.userCase.additionalClaimants[0].address.AddressLine1).toBe('1 New Street');
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should set current edit index from query and render postcode select page with resolved addresses', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.query = { additionalClaimant: '1' };
    req.session.userCase.additionalClaimantEnterPostcode = 'SW1H 9AJ';
    (getAddressesForPostcode as jest.Mock).mockResolvedValue([
      {
        fullAddress: '10 DOWNING STREET, LONDON, SW1A 2AA',
        street1: '10 Downing Street',
        street2: '',
        town: 'London',
        postcode: 'SW1A 2AA',
        country: 'England',
      },
    ]);

    await new AdditionalClaimantPostCodeSelectController().get(req, res);

    expect(req.session.userCase.currentAdditionalClaimantIndex).toBe(1);
    expect(req.session.userCase.additionalClaimantAddresses).toHaveLength(1);
    expect(req.session.userCase.additionalClaimantAddressTypes).toHaveLength(2);
    expect(req.session.userCase.additionalClaimantAddressTypes[0].selected).toBe(true);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.ADDRESS_POSTCODE_SELECT, expect.anything());
  });

  it('should not overwrite entered postcode with empty stored claimant postcode before lookup', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.currentAdditionalClaimantIndex = 0;
    req.session.userCase.additionalClaimants = [{ firstName: 'Jane', lastName: 'Doe' }];
    req.session.userCase.additionalClaimantEnterPostcode = 'SA7 9RN';
    (getAddressesForPostcode as jest.Mock).mockResolvedValue([
      {
        fullAddress: '17 PANTYBLAWD ROAD, LLANSAMLET, ABERTAWE, SA7 9RN',
        street1: '17 Pantyblawd Road',
        street2: 'Llansamlet',
        town: 'Abertawe',
        postcode: 'SA7 9RN',
        country: 'Wales',
      },
    ]);

    await new AdditionalClaimantPostCodeSelectController().get(req, res);

    expect(getAddressesForPostcode).toHaveBeenCalledWith('SA7 9RN');
    expect(req.session.userCase.additionalClaimantAddresses).toHaveLength(1);
  });

  it('should prepopulate editable address fields from current claimant when editing from review flow', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.currentAdditionalClaimantIndex = 0;
    req.session.userCase.additionalClaimants = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        address: {
          AddressLine1: '17 Pantyblawd Road',
          AddressLine2: 'Llansamlet',
          PostTown: 'Abertawe',
          Country: 'Wales',
          PostCode: 'SA7 9RN',
        },
      },
    ];
    req.session.userCase.additionalClaimantEnterPostcode = 'SA7 9RN';
    (getAddressesForPostcode as jest.Mock).mockResolvedValue([
      {
        fullAddress: '17 PANTYBLAWD ROAD, LLANSAMLET, ABERTAWE, SA7 9RN',
        street1: '17 Pantyblawd Road',
        street2: 'Llansamlet',
        town: 'Abertawe',
        postcode: 'SA7 9RN',
        country: 'Wales',
      },
    ]);

    await new AdditionalClaimantPostCodeSelectController().get(req, res);

    expect(getAddressesForPostcode).toHaveBeenCalledWith('SA7 9RN');
    expect(req.session.userCase.additionalClaimantAddress1).toBe('17 Pantyblawd Road');
    expect(req.session.userCase.additionalClaimantAddress2).toBe('Llansamlet');
    expect(req.session.userCase.additionalClaimantAddressTown).toBe('Abertawe');
    expect(req.session.userCase.additionalClaimantAddressCountry).toBe('Wales');
    expect(req.session.userCase.additionalClaimantAddressPostcode).toBe('SA7 9RN');
  });

  it('should not prepopulate claimant address fields when entered postcode differs from stored claimant postcode', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.currentAdditionalClaimantIndex = 0;
    req.session.userCase.additionalClaimants = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        address: {
          AddressLine1: '17 Pantyblawd Road',
          AddressLine2: 'Llansamlet',
          PostTown: 'Abertawe',
          Country: 'Wales',
          PostCode: 'SA7 9RN',
        },
      },
    ];
    req.session.userCase.additionalClaimantEnterPostcode = 'M1 1AA';
    (getAddressesForPostcode as jest.Mock).mockResolvedValue([
      {
        fullAddress: '1 NEW STREET, MANCHESTER, M1 1AA',
        street1: '1 New Street',
        street2: '',
        town: 'Manchester',
        postcode: 'M1 1AA',
        country: 'England',
      },
    ]);

    await new AdditionalClaimantPostCodeSelectController().get(req, res);

    expect(getAddressesForPostcode).toHaveBeenCalledWith('M1 1AA');
    expect(req.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddress2).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressTown).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressCountry).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressPostcode).toBeUndefined();
  });
});
