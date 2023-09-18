import axios, { AxiosResponse } from 'axios';

import StoredApplicationConfirmationController from '../../../main/controllers/StoredApplicationConfirmationController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { Applicant, ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('Store application Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    common: {},
  };

  it('should render the Store application Complete page', async () => {
    const controller = new StoredApplicationConfirmationController();
    caseApi.getUserCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          case_data: {
            genericTseApplicationCollection: [
              {
                id: '1',
                value: {
                  applicant: 'Claimant',
                },
              },
            ],
          },
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const response = mockResponse();
    const request = mockRequest({ t });

    const userCase = request.session.userCase;
    const genericTseApplicationCollection = [
      { value: { applicant: Applicant.CLAIMANT } },
      { value: { applicant: Applicant.RESPONDENT } },
      { value: { applicant: Applicant.ADMIN } },
      { value: { applicant: Applicant.CLAIMANT } },
    ];
    userCase.genericTseApplicationCollection = genericTseApplicationCollection;
    request.session.userCase = userCase;

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STORED_APPLICATION_CONFIRMATION, expect.anything());
  });

  it('should return NOT_FOUND when getLatestApplication', async () => {
    const controller = new StoredApplicationConfirmationController();
    caseApi.getUserCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should return NOT_FOUND when getCaseApi', async () => {
    const controller = new StoredApplicationConfirmationController();
    caseApi.getUserCase = jest.fn().mockRejectedValueOnce('error');
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
