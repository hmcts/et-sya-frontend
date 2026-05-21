import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import AdditionalClaimantPostCodeEnterController from '../../../../main/controllers/multiples/AdditionalClaimantPostCodeEnterController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';
jest.spyOn(CaseHelper, 'handlePostLogic').mockImplementation(() => Promise.resolve());

describe('Additional Claimant Postcode Enter Controller', () => {
  const t = {
    'address-postcode-enter': {},
    common: {},
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the additional claimant postcode enter page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new AdditionalClaimantPostCodeEnterController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ADDRESS_POSTCODE_ENTER, expect.anything());
    expect(response.render).toHaveBeenCalledWith('address-postcode-enter', expect.anything());
  });

  it('should set edit index from query and clear previous selected addresses', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.query = { index: '0' };
    request.session.userCase.additionalClaimantAddressTypes = [{ label: 'old' }];
    request.session.userCase.additionalClaimantAddresses = [{ fullAddress: 'old' }];

    new AdditionalClaimantPostCodeEnterController().get(request, response);

    expect(request.session.userCase.currentAdditionalClaimantIndex).toBe(0);
    expect(request.session.userCase.additionalClaimantAddressTypes).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddresses).toBeUndefined();
  });

  it('should prepopulate postcode and address fields when editing an existing claimant', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.currentAdditionalClaimantIndex = 0;
    request.session.userCase.additionalClaimants = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        address: {
          AddressLine1: '10 Street',
          AddressLine2: 'Area',
          PostTown: 'London',
          Country: 'England',
          PostCode: 'SW1H 9AJ',
        },
      },
    ];

    new AdditionalClaimantPostCodeEnterController().get(request, response);

    expect(request.session.userCase.additionalClaimantAddress1).toBe('10 Street');
    expect(request.session.userCase.additionalClaimantAddress2).toBe('Area');
    expect(request.session.userCase.additionalClaimantAddressTown).toBe('London');
    expect(request.session.userCase.additionalClaimantAddressCountry).toBe('England');
    expect(request.session.userCase.additionalClaimantAddressPostcode).toBe('SW1H 9AJ');
    expect(request.session.userCase.additionalClaimantEnterPostcode).toBe('SW1H 9AJ');
  });

  it('should not throw when editing a claimant without an address object', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.currentAdditionalClaimantIndex = 0;
    request.session.userCase.additionalClaimants = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ];

    expect(() => new AdditionalClaimantPostCodeEnterController().get(request, response)).not.toThrow();
    expect(request.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(request.session.userCase.additionalClaimantEnterPostcode).toBeUndefined();
  });

  it('should render heading with claimant full name on postcode enter page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.query = { index: '0' };
    request.session.userCase.additionalClaimants = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        address: {
          PostCode: 'SW1H 9AJ',
        },
      },
    ];

    new AdditionalClaimantPostCodeEnterController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ADDRESS_POSTCODE_ENTER,
      expect.objectContaining({
        addressPageHeader: 'Contact or home address of Jane Doe',
      })
    );
  });

  it('should call handlePostLogic with additional claimant postcode select redirect', async () => {
    const body = { additionalClaimantEnterPostcode: 'SW1H 9AJ' };
    const req = mockRequest({ body });
    const res = mockResponse();

    await new AdditionalClaimantPostCodeEnterController().post(req, res);
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      req,
      res,
      expect.anything(),
      expect.anything(),
      PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT,
      true
    );
  });

  it('should clear transient address fields when editing claimant postcode is changed', async () => {
    const body = { additionalClaimantEnterPostcode: 'M1 1AA' };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.query = { index: '1' };
    req.session.userCase.additionalClaimants = [
      { firstName: 'John', lastName: 'Smith' },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        address: {
          AddressLine1: '10 Street',
          AddressLine2: 'Area',
          PostTown: 'London',
          Country: 'England',
          PostCode: 'SW1H 9AJ',
        },
      },
    ];
    req.session.userCase.additionalClaimantAddress1 = '10 Street';
    req.session.userCase.additionalClaimantAddress2 = 'Area';
    req.session.userCase.additionalClaimantAddressTown = 'London';
    req.session.userCase.additionalClaimantAddressCountry = 'England';
    req.session.userCase.additionalClaimantAddressPostcode = 'SW1H 9AJ';
    req.session.userCase.additionalClaimantAddressTypes = [{ label: 'old' }];
    req.session.userCase.additionalClaimantAddresses = [{ fullAddress: 'old' }];

    await new AdditionalClaimantPostCodeEnterController().post(req, res);

    expect(req.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddress2).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressTown).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressCountry).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressPostcode).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddressTypes).toBeUndefined();
    expect(req.session.userCase.additionalClaimantAddresses).toBeUndefined();
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      req,
      res,
      expect.anything(),
      expect.anything(),
      PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT,
      true
    );
  });
});
