import AxiosInstance from 'axios';

import ClaimantRepAboutYouController from '../../../main/controllers/ClaimantRepAboutYouController';
import * as ClaimantRepAnswersHelper from '../../../main/controllers/helpers/ClaimantRepAnswersHelper';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as any);

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
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      representativeName: 'Wolfie Smith',
      representativeOrgName: 'Tooting Popular Front',
      representativeType: 'Trade Union',
      repAddress1: '1 Tooting Broadway',
      repAddressTown: 'London',
      repAddressPostcode: 'SW17 1NE',
      representativePhoneNumber: '0208 123 1234',
    } as any);
  });

  it('should render the about you page on successful case load', async () => {
    const mockRows = [{ value: { text: 'Wolfie Smith' } }];
    jest.spyOn(ClaimantRepAnswersHelper, 'getClaimantRepAboutYouDetails').mockReturnValue(mockRows as any);

    const req = mockRequest({ session: { user: { email: 'WSmith@TPF.com' } } });
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

    await controller.get(req, res);

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
  });

  it('should redirect to CLAIMANT_APPLICATIONS when case load fails', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });
});
