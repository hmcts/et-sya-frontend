import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ReviewOtherClaimantsController from '../../../../main/controllers/multiples/ReviewAdditionalClaimantsController';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handlePostLogic').mockImplementation(() => Promise.resolve());

describe('ReviewOtherClaimantsController', () => {
  const t = {
    common: {},
    'review-other-claimants': {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render review page with formatted summary cards and reset edit index', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.currentAdditionalClaimantIndex = 2;
    request.session.userCase.additionalClaimants = [
      {
        title: 'Mr',
        firstName: 'John',
        lastName: 'Doe',
        dob: { day: '01', month: '02', year: '2000' },
        address: {
          AddressLine1: '1 High Street',
          AddressLine2: 'Flat 2',
          PostTown: 'London',
          PostCode: 'SW1A 1AA',
        },
        email: 'john@example.com',
      },
    ];

    new ReviewOtherClaimantsController().get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.REVIEW_ADDITIONAL_CLAIMANTS, expect.anything());
    expect(renderArgs.canAddAnotherClaimant).toBe(true);
    expect(renderArgs.additionalClaimants).toHaveLength(1);
    expect(renderArgs.additionalClaimants[0]).toMatchObject({
      name: 'Mr John Doe',
      dob: '01/02/2000',
      address: '1 High Street<br>Flat 2<br>London<br>SW1A 1AA',
      email: 'john@example.com',
      removeUrl: `${PageUrls.REMOVE_ADDITIONAL_CLAIMANT}?index=0`,
      changeNameUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=0`,
      changeDobUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=0`,
      changeAddressUrl: `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?index=0`,
      changeEmailUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=0`,
    });
    expect(request.session.userCase.currentAdditionalClaimantIndex).toBeUndefined();
  });

  it('should hide add another claimant option when there are already five claimants', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.additionalClaimants = [
      { firstName: 'One', lastName: 'Person' },
      { firstName: 'Two', lastName: 'Person' },
      { firstName: 'Three', lastName: 'Person' },
      { firstName: 'Four', lastName: 'Person' },
      { firstName: 'Five', lastName: 'Person' },
    ];

    new ReviewOtherClaimantsController().get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.canAddAnotherClaimant).toBe(false);
  });

  it('should append welsh language parameter to action links when on welsh page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.url = `${PageUrls.REVIEW_ADDITIONAL_CLAIMANTS}?lng=cy`;
    request.session.userCase.additionalClaimants = [{ firstName: 'John', lastName: 'Doe' }];

    new ReviewOtherClaimantsController().get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.additionalClaimants[0].removeUrl).toBe(`${PageUrls.REMOVE_ADDITIONAL_CLAIMANT}?index=0&lng=cy`);
    expect(renderArgs.additionalClaimants[0].changeAddressUrl).toBe(
      `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?index=0&lng=cy`
    );
  });

  it('should start add-another flow when yes is selected', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { addAdditionalClaimant: YesOrNo.YES },
    });
    request.session.userCase.currentAdditionalClaimantIndex = 1;
    request.session.userCase.additionalClaimantTitle = 'Mr';
    request.session.userCase.additionalClaimantFirstName = 'John';
    request.session.userCase.additionalClaimantLastName = 'Doe';
    request.session.userCase.additionalClaimantEmail = 'john@example.com';
    request.session.userCase.additionalClaimantAddress1 = 'Old address';
    request.session.userCase.additionalClaimantAddressPostcode = 'SW1A 1AA';
    request.session.userCase.additionalClaimantAddressTypes = [{ label: 'old' }];
    request.session.userCase.additionalClaimantAddresses = [{ fullAddress: 'old' }];

    await new ReviewOtherClaimantsController().post(request, response);

    expect(request.session.userCase.currentAdditionalClaimantIndex).toBeUndefined();
    expect(request.session.userCase.additionalClaimantTitle).toBeUndefined();
    expect(request.session.userCase.additionalClaimantFirstName).toBeUndefined();
    expect(request.session.userCase.additionalClaimantLastName).toBeUndefined();
    expect(request.session.userCase.additionalClaimantEmail).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddressPostcode).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddressTypes).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddresses).toBeUndefined();
    expect(response.redirect).not.toHaveBeenCalled();
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      expect.anything(),
      PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS
    );
  });

  it('should redirect to group claims check when no is selected', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { addAdditionalClaimant: YesOrNo.NO },
    });

    await new ReviewOtherClaimantsController().post(request, response);
    expect(response.redirect).not.toHaveBeenCalled();
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      expect.anything(),
      PageUrls.GROUP_REPRESENTATIVE
    );
  });

  it('should redirect to group claims check and block add-another when claimant count is already five', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { addAdditionalClaimant: YesOrNo.YES },
    });
    request.session.userCase.additionalClaimants = [
      { firstName: 'One', lastName: 'Person' },
      { firstName: 'Two', lastName: 'Person' },
      { firstName: 'Three', lastName: 'Person' },
      { firstName: 'Four', lastName: 'Person' },
      { firstName: 'Five', lastName: 'Person' },
    ];

    await new ReviewOtherClaimantsController().post(request, response);

    expect(CaseHelper.handlePostLogic).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.GROUP_REPRESENTATIVE);
  });
});
