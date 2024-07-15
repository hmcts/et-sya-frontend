import AxiosInstance, { AxiosResponse } from 'axios';

import StoreRespondentController from '../../../main/controllers/StoreRespondentController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { ErrorPages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store respondent controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    updateHubLinksStatuses: jest.fn(),
    storeRespondToApplication: jest.fn(),
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

  it('should redirect STORED_RESPONSE_APPLICATION_CONFIRMATION', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    request.session.userCase.genericTseApplicationCollection = [{ id: '246' }];
    request.session.userCase.selectedGenericTseApplication = { id: '246' };

    await new StoreRespondentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/stored-response-application-confirmation/246?lng=en');
  });

  it('should clear TSE fields after storing the case and updating hublink statuses', async () => {
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
    request.session.userCase.genericTseApplicationCollection = [{ id: '246' }];
    request.session.userCase.selectedGenericTseApplication = { id: '246' };

    await new StoreRespondentController().get(request, response);

    expect(request.session.userCase.responseText).toStrictEqual(undefined);
    expect(request.session.userCase.supportingMaterialFile).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyYesOrNo).toStrictEqual(undefined);
  });
});

describe('Store respondent controller return error page', () => {
  const response = mockResponse();
  const request = mockRequest({});
  request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
  request.session.userCase.selectedGenericTseApplication = { id: '246' };

  it('should return error page when storeRespondToApplication failed', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      updateHubLinksStatuses: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
    await new StoreRespondentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page when getUserCase failed', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      updateHubLinksStatuses: jest.fn(),
      storeRespondToApplication: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
    await new StoreRespondentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
