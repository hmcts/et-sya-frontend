import AxiosInstance, { AxiosResponse } from 'axios';

import SubmitTseController from '../../../main/controllers/SubmitTribunalCYAController';
import TribunalResponseStoreController from '../../../main/controllers/TribunalResponseStoreController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal response store controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    updateHubLinksStatuses: jest.fn(),
    storeResponseSendNotification: jest.fn(),
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

  it('should redirect to PageUrls.STORED_RESPONSE_TRIBUNAL_CONFIRMATION', async () => {
    const controller = new TribunalResponseStoreController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    request.session.userCase.selectedRequestOrOrder = { id: '246' };
    request.url = PageUrls.TRIBUNAL_RESPONSE_COMPLETED;

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/stored-response-tribunal-confirmation/246?lng=en');
  });

  it('should change hublink status to STORED before storing the case', () => {
    const controller = new TribunalResponseStoreController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    request.session.userCase.selectedRequestOrOrder = { id: '246' };
    controller.get(request, response);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.STORED);
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
    jest.spyOn(CaseHelper, 'handleUpdateHubLinksStatuses').mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(CaseHelper, 'submitClaimantTse').mockImplementationOnce(() => Promise.resolve());
    await new SubmitTseController().get(request, response);
    expect(request.session.userCase.contactApplicationText).toStrictEqual(undefined);
    expect(request.session.userCase.contactApplicationFile).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyYesOrNo).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyText).toStrictEqual(undefined);
  });
});

describe('Tribunal response store controller return error page', () => {
  const controller = new TribunalResponseStoreController();
  const response = mockResponse();
  const request = mockRequest({});
  request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
  request.session.userCase.selectedRequestOrOrder = { id: '246' };

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

  it('should return error page when storeResponseSendNotification failed', async () => {
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
      storeResponseSendNotification: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page when orderId not found', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      updateHubLinksStatuses: jest.fn(),
      storeResponseSendNotification: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    request.session.userCase.selectedRequestOrOrder = undefined;

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
