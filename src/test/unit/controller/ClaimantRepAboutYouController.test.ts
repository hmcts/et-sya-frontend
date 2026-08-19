import AxiosInstance from 'axios';

import * as AddressLookup from '../../../main/address';
import ClaimantRepAboutYouController from '../../../main/controllers/ClaimantRepAboutYouController';
import * as CaseHelpers from '../../../main/controllers/helpers/CaseHelpers';
import * as ClaimantRepAnswersHelper from '../../../main/controllers/helpers/ClaimantRepAnswersHelper';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../../../main/definitions/hub';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as unknown as CaseWithId);

const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

const mockAddresses = [
  {
    fullAddress: '1 Tooting Broadway, London, SE17 1NE',
    street1: '1 Tooting Broadway',
    town: 'London',
    postcode: 'SE17 1NE',
    country: 'United Kingdom',
  },
  {
    fullAddress: '2 Tooting Broadway, London, SE17 1NE',
    street1: '2 Tooting Broadway',
    town: 'London',
    postcode: 'SE17 1NE',
    country: 'United Kingdom',
  },
];

const completedFormBody = {
  representativeName: 'Wolfie Smith',
  representativeOrgName: 'Tooting Popular Front',
  representativeType: 'Trade Union',
  repAddress1: '1 Tooting Broadway',
  repAddress2: '',
  repAddressTown: 'London',
  repAddressPostcode: 'SE17 1NE',
  claimantRepEmail: 'WSmith@TPF.com',
  representativePhoneNumber: '0208 123 1234',
};

describe('ClaimantRepAboutYouController', () => {
  let controller: ClaimantRepAboutYouController;

  beforeEach(() => {
    controller = new ClaimantRepAboutYouController();
    jest.clearAllMocks();
    jest.spyOn(ClaimantRepAnswersHelper, 'populateClaimantRepDetailsFromCase').mockImplementation(() => undefined);
    jest.spyOn(CaseHelpers, 'handleUpdateClaimantRepAboutYou').mockResolvedValue(undefined);
    jest.spyOn(CaseHelpers, 'handleUpdateHubLinksStatuses').mockResolvedValue(undefined);
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      ...completedFormBody,
      hubLinksStatuses: { [HubLinkNames.AboutYou]: HubLinkStatus.OPTIONAL },
    } as unknown as CaseWithId);
  });

  it('should render the about you form on successful case load', async () => {
    const req = mockRequest({ session: { user: { email: 'WSmith@TPF.com' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.get(req, res);

    expect(ClaimantRepAnswersHelper.populateClaimantRepDetailsFromCase).toHaveBeenCalled();
    const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, renderArgs);
    expect(renderArgs.backLinkUrl).toBe('/claimant-rep-hub/case-123' + languages.ENGLISH_URL_PARAMETER);
    expect(renderArgs.cancelLink).toBe('/claimant-rep-hub/case-123' + languages.ENGLISH_URL_PARAMETER);
    expect(Object.keys(renderArgs.form.fields)).toEqual(
      expect.arrayContaining([
        'representativeName',
        'representativeOrgName',
        'representativeType',
        'representativeEnterPostcode',
        'repAddress1',
        'repAddress2',
        'repAddressTown',
        'repAddressPostcode',
        'claimantRepEmail',
        'representativePhoneNumber',
      ])
    );
  });

  it('should fill the address fields from the address selected in the list', async () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: 'case-123',
          representativeAddressTypes: '0',
          representativeAddresses: mockAddresses,
        },
      },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.get(req, res);

    expect(req.session.userCase.repAddress1).toBe('1 Tooting Broadway');
    expect(req.session.userCase.repAddressTown).toBe('London');
    expect(req.session.userCase.repAddressPostcode).toBe('SE17 1NE');
    expect(req.session.userCase.representativeAddressTypes).toBeUndefined();
  });

  it('should keep the address when the list is left on the "addresses found" placeholder', async () => {
    const req = mockRequest({
      session: {
        userCase: {
          id: 'case-123',
          repAddress1: '1 Tooting Broadway',
          representativeAddressTypes: 'Several addresses found',
          representativeAddresses: mockAddresses,
        },
      },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.get(req, res);

    expect(req.session.userCase.repAddress1).toBe('1 Tooting Broadway');
    expect(req.session.userCase.representativeAddressTypes).toBeUndefined();
  });

  it('should list the addresses found by the last lookup', async () => {
    const req = mockRequest({
      session: { userCase: { id: 'case-123', representativeAddresses: mockAddresses } },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.get(req, res);

    const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.form.fields.representativeAddressTypes.values).toHaveLength(3);
    expect(renderArgs.form.fields.representativeAddressTypes.values[0].label).toBe('Several addresses found');
    expect(renderArgs.form.fields.representativeAddressTypes.values[1].label).toBe(mockAddresses[0].fullAddress);
  });

  it('should not list any addresses before a lookup is made', async () => {
    const req = mockRequest({ session: { userCase: { id: 'case-123' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.get(req, res);

    const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.form.fields.representativeAddressTypes.values).toHaveLength(0);
  });

  it('should redirect to CLAIMANT_APPLICATIONS when case load fails', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should save the entered details and redirect to rep hub', async () => {
    const req = mockRequest({ body: completedFormBody, session: { user: { email: 'WSmith@TPF.com' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.userCase.representativeName).toBe('Wolfie Smith');
    expect(req.session.userCase.repAddress1).toBe('1 Tooting Broadway');
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).toHaveBeenCalled();
    expect(CaseHelpers.handleUpdateHubLinksStatuses).toHaveBeenCalled();
    expect(req.session.userCase.hubLinksStatuses[HubLinkNames.AboutYou]).toBe(HubLinkStatus.VIEWED);
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-hub/case-123');
  });

  it('should return field errors when the form is invalid', async () => {
    const req = mockRequest({
      body: { ...completedFormBody, representativeName: '', claimantRepEmail: 'not-an-email' },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    req.url = '/claimant-rep-about-you/case-123';
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.errors).toEqual([
      { propertyName: 'representativeName', errorType: 'required' },
      { propertyName: 'claimantRepEmail', errorType: 'invalid' },
    ]);
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });

  it('should redirect back to about you when required details are missing', async () => {
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      hubLinksStatuses: { [HubLinkNames.AboutYou]: HubLinkStatus.OPTIONAL },
    } as unknown as CaseWithId);

    const req = mockRequest({ body: { ...completedFormBody, claimantRepEmail: '' } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    req.url = '/claimant-rep-about-you/case-123';
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'claimantRepEmail', errorType: 'required' }]);
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });

  it('should look up the addresses and stay on the page when finding an address', async () => {
    const getAddresses = jest.spyOn(AddressLookup, 'getAddressesForPostcode').mockResolvedValue(mockAddresses);
    const req = mockRequest({
      body: { ...completedFormBody, representativeEnterPostcode: 'SE17 1NE', findAddress: 'true' },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(getAddresses).toHaveBeenCalledWith('SE17 1NE');
    expect(req.session.userCase.representativeAddresses).toHaveLength(2);
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });

  it('should keep unsaved edits when finding an address', async () => {
    jest.spyOn(AddressLookup, 'getAddressesForPostcode').mockResolvedValue(mockAddresses);
    const req = mockRequest({
      body: {
        ...completedFormBody,
        representativeName: 'Wolfie Smith Jr',
        representativeEnterPostcode: 'SE17 1NE',
        findAddress: 'true',
      },
      session: {
        userCase: { id: 'case-123' },
        claimantRepAboutYouPendingDisplay: { representativeName: 'Wolfie Smith' },
      },
    });
    req.params = { caseId: 'case-123' };

    await controller.post(req, mockResponse());
    await controller.get(req, mockResponse());

    expect(req.session.userCase.representativeName).toBe('Wolfie Smith Jr');
  });

  it('should keep the addresses found when the case api returns a numeric case id', async () => {
    // CCD returns the case id as a number, so the session case only matches req.params.caseId as a string
    const numericCaseId = 1234567890123456;
    jest.spyOn(AddressLookup, 'getAddressesForPostcode').mockResolvedValue(mockAddresses);
    // a reload of the case builds a fresh object, as the real formatter does
    jest
      .spyOn(ApiFormatter, 'fromApiFormat')
      .mockImplementation(() => ({ id: numericCaseId, ...completedFormBody } as unknown as CaseWithId));

    const req = mockRequest({
      body: { ...completedFormBody, representativeEnterPostcode: 'SE17 1NE', findAddress: 'true' },
      session: { userCase: { id: numericCaseId }, user: { email: 'WSmith@TPF.com' } },
    });
    req.params = { caseId: String(numericCaseId) };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, mockResponse());
    expect(req.session.userCase.representativeAddresses).toHaveLength(2);

    const res = mockResponse();
    await controller.get(req, res);

    const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.form.fields.representativeAddressTypes.values).toHaveLength(3);
    expect(req.session.userCase.representativeEnterPostcode).toBe('SE17 1NE');
  });

  it('should leave an empty list when the postcode lookup fails', async () => {
    jest.spyOn(AddressLookup, 'getAddressesForPostcode').mockRejectedValue(new Error('lookup down'));
    const req = mockRequest({
      body: { ...completedFormBody, representativeEnterPostcode: 'SE17 1NE', findAddress: 'true' },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.userCase.representativeAddresses).toEqual([]);
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });

  it('should fill the address fields when an address is picked from the list', async () => {
    const req = mockRequest({
      body: { ...completedFormBody, representativeAddressTypes: '1', selectAddress: 'true' },
      session: { userCase: { id: 'case-123', representativeAddresses: mockAddresses } },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.post(req, res);

    expect(req.session.userCase.repAddress1).toBe('2 Tooting Broadway');
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });

  it('should keep the picked address when earlier details are held for display', async () => {
    const req = mockRequest({
      body: { ...completedFormBody, representativeAddressTypes: '1', selectAddress: 'true' },
      session: {
        userCase: { id: 'case-123', representativeAddresses: mockAddresses },
        claimantRepAboutYouPendingDisplay: {
          repAddress1: '1 Old Street',
          repAddressTown: 'Oldtown',
          repAddressPostcode: 'OLD 1AA',
        },
      },
    });
    req.params = { caseId: 'case-123' };

    await controller.post(req, mockResponse());
    const res = mockResponse();
    await controller.get(req, res);

    expect(req.session.userCase.repAddress1).toBe('2 Tooting Broadway');
    expect(req.session.userCase.repAddressPostcode).toBe('SE17 1NE');
  });

  it('should save the address left selected in the list', async () => {
    const req = mockRequest({
      body: { ...completedFormBody, repAddress1: '', repAddressTown: '', representativeAddressTypes: '1' },
      session: { userCase: { id: 'case-123', representativeAddresses: mockAddresses } },
    });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };

    await controller.post(req, res);

    expect(req.session.userCase.repAddress1).toBe('2 Tooting Broadway');
    expect(req.session.errors).toEqual([]);
    expect(CaseHelpers.handleUpdateClaimantRepAboutYou).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-hub/case-123');
  });

  it('should return a postcode error when finding an address without a valid postcode', async () => {
    const req = mockRequest({ body: { ...completedFormBody, representativeEnterPostcode: '', findAddress: 'true' } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    req.url = '/claimant-rep-about-you/case-123';
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'representativeEnterPostcode', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
  });
});
