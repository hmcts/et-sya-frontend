import axios from 'axios';

import JudgmentDetailsController from '../../../main/controllers/JudgmentDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import judgmentDetailsRaw from '../../../main/resources/locales/en/translation/judgment-details.json';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(mockedAxios);

describe('Judgment Details Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
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

  it('should get judgment details page with attachments', async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationSubjectString: 'Judgment',
            sendNotificationResponseTribunal: ResponseRequired.YES,
            sendNotificationTitle: 'Test Judgment',
            sendNotificationDecision: 'Granted',
            sendNotificationSentBy: 'Judge',
            sendNotificationWhoMadeJudgement: 'Employment Judge',
            sendNotificationFullName2: 'Judge Smith',
            sendNotificationNotify: Parties.BOTH_PARTIES,
            date: '2023-05-05',
            sendNotificationUploadDocument: [
              {
                id: '1',
                value: {
                  typeOfDocument: 'Judgment document',
                  uploadedDocument: {
                    document_filename: 'judgment.pdf',
                    document_url: 'http://test.com/judgment.pdf',
                    document_binary_url: 'http://test.com/binary/judgment.pdf',
                  },
                },
              },
            ],
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.JUDGMENT_DETAILS;
    request.params.appId = '1';

    const controller = new JudgmentDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.JUDGMENT_DETAILS,
      expect.objectContaining({
        selectedJudgment: expect.objectContaining({
          id: '1',
        }),
        pageContent: expect.any(Array),
      })
    );
  });
});
