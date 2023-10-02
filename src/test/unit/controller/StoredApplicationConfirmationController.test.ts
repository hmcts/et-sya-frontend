import axios, { AxiosResponse } from 'axios';

import StoredApplicationConfirmationController from '../../../main/controllers/StoredApplicationConfirmationController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { Applicant, ErrorPages, TranslationKeys, languages } from '../../../main/definitions/constants';
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
  const genericTseApplicationCollection = [
    { value: { applicant: Applicant.CLAIMANT } },
    { value: { applicant: Applicant.RESPONDENT } },
    { value: { applicant: Applicant.ADMIN } },
    { value: { applicant: Applicant.CLAIMANT } },
  ];

  it('should render the Store application Complete page', async () => {
    const controller = new StoredApplicationConfirmationController();
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
    const response = mockResponse();
    const request = mockRequest({ t });

    const userCase = request.session.userCase;
    userCase.genericTseApplicationCollection = genericTseApplicationCollection;
    request.session.userCase = userCase;

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_APPLICATION_CONFIRMATION,
      expect.objectContaining({
        redirectUrl: '/citizen-hub/135',
        viewThisCorrespondenceLink: '/application-details/246?lng=en',
        document: undefined,
        documentLink: '',
      })
    );
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
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });

  it('should return NOT_FOUND when getCaseApi', async () => {
    const controller = new StoredApplicationConfirmationController();
    caseApi.getUserCase = jest.fn().mockRejectedValueOnce('error');
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });
});
