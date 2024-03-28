import AxiosInstance, { AxiosResponse } from 'axios';

import StoreTseController from '../../../main/controllers/StoreTseController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { Applicant, ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const genericTseApplicationCollection = [
  { value: { applicant: Applicant.CLAIMANT } },
  { value: { applicant: Applicant.RESPONDENT } },
  { value: { applicant: Applicant.ADMIN } },
  { value: { applicant: Applicant.CLAIMANT } },
];

describe('Store tell something else Controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    updateHubLinksStatuses: jest.fn(),
    storeClaimantTse: jest.fn(),
    getUserCase: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.getUserCase = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        id: '135',
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          genericTseApplicationCollection: [
            {
              id: '246',
              value: {
                applicant: 'Claimant',
              },
            },
          ],
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  it('should redirect to PageUrls.STORED_APPLICATION_CONFIRMATION', async () => {
    const controller = new StoreTseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    request.session.userCase.genericTseApplicationCollection = genericTseApplicationCollection;
    request.url = PageUrls.STORED_APPLICATION_CONFIRMATION + '?lng=en';

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/stored-application-confirmation/246?lng=en');
  });

  it('should change hublink status to STORED before storing the case', () => {
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

describe('Store tell something else Controller return error page', () => {
  const controller = new StoreTseController();
  const response = mockResponse();
  const request = mockRequest({});
  request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
  request.session.userCase.genericTseApplicationCollection = genericTseApplicationCollection;
  request.url = PageUrls.STORED_APPLICATION_CONFIRMATION + '?lng=en';

  it('should return error page when updateHubLinksStatuses failed', () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page when storeClaimantTse failed', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      updateHubLinksStatuses: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page when getUserCase failed', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      updateHubLinksStatuses: jest.fn(),
      storeClaimantTse: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
