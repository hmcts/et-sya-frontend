import AxiosInstance from 'axios';

import StoreTseController from '../../../main/controllers/StoreTseController';
import { PageUrls } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const mockCaseApi = {
  axios: AxiosInstance,
  createCase: jest.fn(),
  getUserCases: jest.fn(),
  downloadClaimPdf: jest.fn(),
  getCaseDocument: jest.fn(),
  getDocumentDetails: jest.fn(),
  updateDraftCase: jest.fn(),
  updateHubLinksStatuses: jest.fn(),
  submitClaimantTse: jest.fn(),
  storeClaimantTse: jest.fn(),
  storedToSubmitClaimantTse: jest.fn(),
  respondToApplication: jest.fn(),
  changeApplicationStatus: jest.fn(),
  updateSendNotificationState: jest.fn(),
  updateJudgmentNotificationState: jest.fn(),
  updateDecisionState: jest.fn(),
  addResponseSendNotification: jest.fn(),
  updateResponseAsViewed: jest.fn(),
  getUserCase: jest.fn(),
  submitCase: jest.fn(),
  uploadDocument: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('Store tell something else Controller', () => {
  it('should redirect to PageUrls.STORED_APPLICATION_CONFIRMATION', async () => {
    const controller = new StoreTseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    request.url = PageUrls.STORED_APPLICATION_CONFIRMATION + '?lng=en';
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.STORED_APPLICATION_CONFIRMATION + '?lng=en');
  });

  it('should change hublink status to STORED before submitting the case', () => {
    const controller = new StoreTseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    controller.get(request, response);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toStrictEqual(
      HubLinkStatus.STORED
    );
  });

  it('should clear TSE fields after submitting the case and updating hublink statuses', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.contactApplicationText = 'Test text';
    request.session.userCase.contactApplicationFile = {
      document_url: 'testpage',
      document_filename: 'testname',
      document_binary_url: 'testbinary',
      document_size: 5,
      document_mime_type: 'pdf',
    };
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    await new StoreTseController().get(request, response);
    expect(request.session.userCase.contactApplicationText).toStrictEqual(undefined);
    expect(request.session.userCase.contactApplicationFile).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyYesOrNo).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyText).toStrictEqual(undefined);
  });
});
