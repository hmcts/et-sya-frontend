import AxiosInstance from 'axios';

import * as CaseHelpers from '../../../../main/controllers/helpers/CaseHelpers';
import * as CitizenHubHelper from '../../../../main/controllers/helpers/CitizenHubHelper';
import * as TribunalHelper from '../../../../main/controllers/helpers/TribunalOrderOrRequestDetailsHelper';
import * as MultiplePanelHelper from '../../../../main/controllers/helpers/multiples/MultiplePanelHelper';
import ClaimantRepHubController from '../../../../main/controllers/non-hmcts/ClaimantRepHubController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { HubLinkStatus, HubLinksStatuses } from '../../../../main/definitions/hub';
import * as ApiFormatter from '../../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as any);
jest.spyOn(CaseHelpers, 'handleUpdateHubLinksStatuses').mockResolvedValue();
jest.spyOn(MultiplePanelHelper, 'showMutipleData').mockResolvedValue(false);
jest.spyOn(MultiplePanelHelper, 'getMultiplePanelData').mockResolvedValue(undefined);
jest.spyOn(TribunalHelper, 'activateTribunalOrdersAndRequestsLink').mockResolvedValue();

const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('ClaimantRepHubController', () => {
  let controller: ClaimantRepHubController;

  beforeEach(() => {
    controller = new ClaimantRepHubController();
    jest.clearAllMocks();
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as any);
    jest.spyOn(CaseHelpers, 'handleUpdateHubLinksStatuses').mockResolvedValue();
  });

  describe('get()', () => {
    it('should render the claimant rep hub page on successful case load', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: { id: 'case-123' } });

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_HUB, expect.anything());
    });

    it('should redirect to CLAIMANT_APPLICATIONS when case load fails', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

      await controller.get(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should initialise hubLinksStatuses when not present on userCase', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123', hubLinksStatuses: undefined } as any);
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      expect(CaseHelpers.handleUpdateHubLinksStatuses).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_HUB, expect.anything());
    });

    it('should skip re-initialising hubLinksStatuses when already set', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      const existingStatuses = new HubLinksStatuses();
      existingStatuses['documents'] = HubLinkStatus.READY_TO_VIEW;
      jest
        .spyOn(ApiFormatter, 'fromApiFormat')
        .mockReturnValue({ id: 'case-123', hubLinksStatuses: existingStatuses } as any);
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      expect(CaseHelpers.handleUpdateHubLinksStatuses).not.toHaveBeenCalled();
    });

    it('should pass sections to the render context', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.sections).toBeDefined();
      expect(Array.isArray(renderArgs.sections)).toBe(true);
      // 8 sections: About you + 7 standard hub sections
      expect(renderArgs.sections).toHaveLength(8);
    });

    it('should include the "About you" section as the first section', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      const aboutYouSection = renderArgs.sections[0];
      const l = { sectionAboutYou: 'About you' };
      expect(aboutYouSection.title(l)).toBe('About you');
      expect(aboutYouSection.links).toHaveLength(1);
      expect(aboutYouSection.links[0].shouldShow).toBe(false);
    });

    it('should include "View claimant contact details" in The Claim section', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      // Section index 1 is "The claim" (after "About you")
      const claimSection = renderArgs.sections[1];
      const l = { viewClaimantContactDetails: 'View claimant contact details' };
      const claimantContactLink = claimSection.links.find(
        (link: { linkTxt: (l: unknown) => string }) => link.linkTxt(l) === 'View claimant contact details'
      );
      expect(claimantContactLink).toBeDefined();
    });

    it('should pass showSubmittedAlert based on case state', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
        id: 'case-123',
        state: CaseState.SUBMITTED,
      } as any);
      jest.spyOn(CitizenHubHelper, 'shouldShowSubmittedAlert').mockReturnValue(true);
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.showSubmittedAlert).toBe(true);
    });

    it('should pass progressBarItems to render context', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.progressBarItems).toBeDefined();
    });

    it('should pass languageParam to render context', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };
      (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: {} });

      await controller.get(req, res);

      const renderArgs = (res.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs).toHaveProperty('languageParam');
    });
  });
});
