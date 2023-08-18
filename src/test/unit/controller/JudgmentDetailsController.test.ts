import JudgmentDetailsController from '../../../main/controllers/JudgmentDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, ResponseRequired } from '../../../main/definitions/constants';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import judgmentDetailsRaw from '../../../main/resources/locales/en/translation/judgment-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import axios from 'axios';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockDocumentDetailsResponseData } from '../mocks/mockDocumentDetailsResponse';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(mockedAxios);

const documentRejection = Promise.reject(new Error('Mocked failure to get document metadata'))

describe('Judgment Details Controller', () => {
  getCaseApiMock.mockReturnValue(api);
  const translationJsons = { ...judgmentDetailsRaw, ...commonRaw };

  it('should get judgment details page', async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationSubjectString: 'Judgment',
            sendNotificationResponseTribunal: ResponseRequired.YES,
            sendNotificationTitle: 'test',
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.JUDGMENT_DETAILS;
    request.params.id = '1';

    const controller = new JudgmentDetailsController();
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.JUDGMENT_DETAILS, expect.anything());
  });

  it.each([
    { name: 'application', url: 'uuid1' },
    { name: 'response', url: 'uuid2' },
    { name: 'decision', url: 'uuid3' },
  ])('should redirect to not found page when $type document cannot be resolved', async (args) => {
    api.getDocumentDetails = jest.fn().mockImplementation((docId) =>
      docId === args.url ? documentRejection : Promise.resolve(mockDocumentDetailsResponseData)
    )

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1)
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.JUDGMENT_DETAILS;
    request.params.id = '1';

    const controller = new JudgmentDetailsController();
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  })
});
