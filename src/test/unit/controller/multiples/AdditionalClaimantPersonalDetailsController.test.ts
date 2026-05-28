import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import AdditionalClaimantPersonalDetailsController from '../../../../main/controllers/multiples/AdditionalClaimantPersonalDetailsController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('AdditionalClaimantPersonalDetailsController', () => {
  const t = {
    common: {},
    'additional-claimant-personal-details': {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render and retain existing form state when opening without an edit index', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.additionalClaimantTitle = 'Mx';
    request.session.userCase.additionalClaimantFirstName = 'Old';
    request.session.userCase.additionalClaimantLastName = 'Value';
    request.session.userCase.additionalClaimantEmail = 'old@example.com';
    request.session.userCase.additionalClaimantAddress1 = 'Old address';
    request.session.userCase.currentAdditionalClaimantIndex = undefined;

    new AdditionalClaimantPersonalDetailsController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS,
      expect.anything()
    );
    expect(request.session.userCase.additionalClaimantTitle).toBe('Mx');
    expect(request.session.userCase.additionalClaimantFirstName).toBe('Old');
    expect(request.session.userCase.additionalClaimantLastName).toBe('Value');
    expect(request.session.userCase.additionalClaimantEmail).toBe('old@example.com');
    expect(request.session.userCase.additionalClaimantAddress1).toBe('Old address');
  });

  it('should set index from query and prepopulate when editing an existing claimant', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.query = { additionalClaimant: '0' };
    request.session.userCase.additionalClaimants = [
      {
        title: 'Mrs',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        dob: { day: '01', month: '02', year: '2000' },
        address: {
          AddressLine1: '10 Test Street',
          AddressLine2: 'Area',
          PostTown: 'London',
          Country: 'England',
          PostCode: 'SW1H 9AJ',
        },
      },
    ];

    new AdditionalClaimantPersonalDetailsController().get(request, response);

    expect(request.session.userCase.currentAdditionalClaimantIndex).toBe(0);
    expect(request.session.userCase.additionalClaimantTitle).toBe('Mrs');
    expect(request.session.userCase.additionalClaimantFirstName).toBe('Jane');
    expect(request.session.userCase.additionalClaimantLastName).toBe('Doe');
    expect(request.session.userCase.additionalClaimantEmail).toBe('jane@example.com');
    expect(request.session.userCase.additionalClaimantAddressPostcode).toBe('SW1H 9AJ');
    expect(request.session.userCase.additionalClaimantEnterPostcode).toBe('SW1H 9AJ');

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    const dobValues = renderArgs.form.fields.additionalClaimantDob.values;
    expect(dobValues.find((v: { name: string }) => v.name === 'day').value).toBe('01');
    expect(dobValues.find((v: { name: string }) => v.name === 'month').value).toBe('02');
    expect(dobValues.find((v: { name: string }) => v.name === 'year').value).toBe('2000');
  });

  it('should set validation errors, redirect back, and keep entered personal details when invalid data is posted', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: {
        additionalClaimantTitle: 'Mr',
        additionalClaimantFirstName: 'John',
      },
    });
    request.url = PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS;

    await new AdditionalClaimantPersonalDetailsController().post(request, response);

    expect(request.session.errors).toBeDefined();
    expect(request.session.errors.length).toBeGreaterThan(0);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
    expect(CaseHelper.handleUpdateDraftCase).not.toHaveBeenCalled();
    expect(request.session.userCase.additionalClaimantTitle).toBe('Mr');
    expect(request.session.userCase.additionalClaimantFirstName).toBe('John');
  });

  it('should add a new claimant, clear address fields, and continue to postcode entry', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: {
        additionalClaimantTitle: 'Ms',
        additionalClaimantFirstName: 'Alice',
        additionalClaimantLastName: 'Smith',
        additionalClaimantEmail: 'alice@example.com',
      },
    });
    request.session.userCase.additionalClaimants = [];
    request.session.userCase.additionalClaimantAddress1 = 'stale';
    request.session.userCase.additionalClaimantAddressPostcode = 'SW1A 1AA';
    request.session.userCase.additionalClaimantAddressTypes = [{ label: 'stale' }];
    request.session.userCase.additionalClaimantAddresses = [{ fullAddress: 'stale' }];

    await new AdditionalClaimantPersonalDetailsController().post(request, response);

    expect(request.session.userCase.additionalClaimants).toHaveLength(1);
    expect(request.session.userCase.currentAdditionalClaimantIndex).toBe(0);
    expect(request.session.userCase.additionalClaimants[0].firstName).toBe('Alice');
    expect(request.session.userCase.additionalClaimantAddress1).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddressPostcode).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddressTypes).toBeUndefined();
    expect(request.session.userCase.additionalClaimantAddresses).toBeUndefined();
    expect(CaseHelper.handleUpdateDraftCase).toHaveBeenCalledWith(request, expect.anything());
    expect(response.redirect).toHaveBeenCalledWith(
      `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?additionalClaimant=0`
    );
  });

  it('should update an existing claimant and preserve address fields', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: {
        additionalClaimantTitle: 'Mr',
        additionalClaimantFirstName: 'Updated',
        additionalClaimantLastName: 'Person',
        additionalClaimantEmail: 'updated@example.com',
      },
    });
    request.session.userCase.additionalClaimants = [
      {
        title: 'Old',
        firstName: 'Old',
        lastName: 'Name',
        address: {
          AddressLine1: '1 Existing Road',
          AddressLine2: 'Flat 2',
          PostTown: 'Leeds',
          Country: 'England',
          PostCode: 'LS1 1AA',
        },
      },
    ];
    request.session.userCase.currentAdditionalClaimantIndex = 0;

    await new AdditionalClaimantPersonalDetailsController().post(request, response);

    expect(request.session.userCase.additionalClaimants[0].firstName).toBe('Updated');
    expect(request.session.userCase.additionalClaimants[0].lastName).toBe('Person');
    expect(request.session.userCase.additionalClaimants[0].address.AddressLine1).toBe('1 Existing Road');
    expect(request.session.userCase.additionalClaimants[0].address.PostCode).toBe('LS1 1AA');
    expect(request.session.userCase.additionalClaimantAddress1).toBe('1 Existing Road');
    expect(request.session.userCase.additionalClaimantEnterPostcode).toBe('LS1 1AA');
    expect(CaseHelper.handleUpdateDraftCase).toHaveBeenCalledWith(request, expect.anything());
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
  });

  it('should not add a claimant when there are already five and should redirect to review page', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: {
        additionalClaimantTitle: 'Ms',
        additionalClaimantFirstName: 'Sixth',
        additionalClaimantLastName: 'Person',
        additionalClaimantEmail: 'sixth@example.com',
      },
    });
    request.session.userCase.additionalClaimants = [
      { firstName: 'One', lastName: 'Person' },
      { firstName: 'Two', lastName: 'Person' },
      { firstName: 'Three', lastName: 'Person' },
      { firstName: 'Four', lastName: 'Person' },
      { firstName: 'Five', lastName: 'Person' },
    ];
    request.session.userCase.currentAdditionalClaimantIndex = undefined;

    await new AdditionalClaimantPersonalDetailsController().post(request, response);

    expect(request.session.userCase.additionalClaimants).toHaveLength(5);
    expect(request.session.userCase.currentAdditionalClaimantIndex).toBeUndefined();
    expect(CaseHelper.handleUpdateDraftCase).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
  });
});
