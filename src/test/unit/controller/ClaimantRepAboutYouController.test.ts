import AxiosInstance from 'axios';

import ClaimantRepAboutYouController from '../../../main/controllers/ClaimantRepAboutYouController';
import * as CaseHelpers from '../../../main/controllers/helpers/CaseHelpers';
import * as ClaimantRepAnswersHelper from '../../../main/controllers/helpers/ClaimantRepAnswersHelper';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { SummaryListRow } from '../../../main/definitions/govuk/govukSummaryList';
import { HubLinkNames, HubLinkStatus } from '../../../main/definitions/hub';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as CaseWithId);

const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('ClaimantRepAboutYouController', () => {
  let controller: ClaimantRepAboutYouController;

  beforeEach(() => {
    controller = new ClaimantRepAboutYouController();
    jest.clearAllMocks();
    jest.spyOn(ClaimantRepAnswersHelper, 'populateClaimantRepDetailsFromCase').mockImplementation(() => undefined);
    jest.spyOn(CaseHelpers, 'handleUpdateDraftCase').mockResolvedValue(undefined);
    jest.spyOn(CaseHelpers, 'handleUpdateHubLinksStatuses').mockResolvedValue(undefined);
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      representativeName: 'Wolfie Smith',
      representativeOrgName: 'Tooting Popular Front',
      representativeType: 'Trade Union',
      repAddress1: '1 Tooting Broadway',
      repAddressTown: 'London',
      repAddressPostcode: 'SW17 1NE',
      representativePhoneNumber: '0208 123 1234',
      hubLinksStatuses: { [HubLinkNames.AboutYou]: HubLinkStatus.OPTIONAL },
    } as CaseWithId);
  });

  it('should render the about you page on successful case load', async () => {
    const mockRows = [{ value: { text: 'Wolfie Smith' } }] as SummaryListRow[];
    jest.spyOn(ClaimantRepAnswersHelper, 'getClaimantRepAboutYouDetails').mockReturnValue(mockRows);

    const req = mockRequest({ session: { user: { email: 'WSmith@TPF.com' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.get(req, res);

    expect(ClaimantRepAnswersHelper.populateClaimantRepDetailsFromCase).toHaveBeenCalled();
    expect(ClaimantRepAnswersHelper.getClaimantRepAboutYouDetails).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'case-123' }),
      'WSmith@TPF.com',
      expect.any(Object),
      expect.any(String)
    );
    const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, renderArgs);
    expect(renderArgs.backLinkUrl).toBe('/claimant-rep-hub/case-123' + languages.ENGLISH_URL_PARAMETER);
    expect(renderArgs.contactTribunalUrl).toBe(PageUrls.CONTACT_THE_TRIBUNAL + languages.ENGLISH_URL_PARAMETER);
    expect(renderArgs.aboutYouRows).toBe(mockRows);
    expect(renderArgs.form).toBeDefined();
  });

  it('should redirect to CLAIMANT_APPLICATIONS when case load fails', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should redirect to rep hub on successful submit', async () => {
    const req = mockRequest({ session: { user: { email: 'WSmith@TPF.com' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(CaseHelpers.handleUpdateDraftCase).toHaveBeenCalled();
    expect(CaseHelpers.handleUpdateHubLinksStatuses).toHaveBeenCalled();
    expect(req.session.userCase.hubLinksStatuses[HubLinkNames.AboutYou]).toBe(HubLinkStatus.VIEWED);
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-hub/case-123');
  });

  it('should redirect back to about you when representative details are incomplete', async () => {
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      hubLinksStatuses: { [HubLinkNames.AboutYou]: HubLinkStatus.OPTIONAL },
    } as CaseWithId);

    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'hiddenErrorField', errorType: 'invalid' }]);
    expect(res.redirect).toHaveBeenCalledWith('/claimant-rep-about-you/case-123');
    expect(CaseHelpers.handleUpdateDraftCase).not.toHaveBeenCalled();
  });
});
