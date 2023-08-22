import axios, { AxiosResponse } from 'axios';

import ApplicationDetailsController from '../../../main/controllers/ApplicationDetailsController';
import { DocumentDetailsResponse } from '../../../main/definitions/api/documentDetailsResponse';
import { CaseWithId } from '../../../main/definitions/case';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import applicationDetails from '../../../main/resources/locales/en/translation/application-details.json';
import common from '../../../main/resources/locales/en/translation/common.json';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Claimant Applications Controller', () => {
  const translationJsons = { ...applicationDetails, ...common };
  const t = {
    common: {},
  };

  it('should render the claimant application details page', async () => {
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.getDocumentDetails = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          createdOn: '2022-05-11',
          size: 1,
          mimeType: 'pdf',
        },
      } as AxiosResponse<DocumentDetailsResponse>)
    );
    const controller = new ApplicationDetailsController();

    const userCase: Partial<CaseWithId> = mockUserCase;
    userCase.genericTseApplicationCollection = mockGenericTseCollection;

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_DETAILS, expect.anything());
  });

  it('should redirect to the claimant not found page', async () => {
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.getDocumentDetails = jest.fn().mockResolvedValue({});
    const controller = new ApplicationDetailsController();

    const userCase: Partial<CaseWithId> = mockUserCase;
    userCase.genericTseApplicationCollection = mockGenericTseCollection;

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(`${ErrorPages.NOT_FOUND}?lng=en`);
  });
});
