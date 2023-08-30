import axios from 'axios';

import RespondentApplicationDetailsController from '../../../main/controllers/RespondentApplicationDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import respondentApplicationDetailsRaw from '../../../main/resources/locales/en/translation/respondent-application-details.json';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import {
  mockRespAppWithClaimantResponse,
  mockRespAppWithDecisionNotViewed,
  mockRespAppWithRespRequstForClaimantInfo,
  mockRespAppWithRespRequstForInfo,
  mockRespAppWithRespRequstForInfoAndReply,
  mockSimpleRespAppTypeItem,
} from '../mocks/mockApplications';
import { mockDocumentDetailsResponse, mockDocumentDetailsResponseData } from '../mocks/mockDocumentDetailsResponse';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { clone } from '../test-helpers/clone';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(mockedAxios);

api.getDocumentDetails = jest.fn().mockResolvedValue({ data: mockDocumentDetailsResponse });
const documentRejection = Promise.reject(new Error('Mocked failure to get document metadata'));

describe('Respondent application details controller', () => {
  getCaseApiMock.mockReturnValue(api);
  beforeEach(() => {
    mockedAxios.put.mockClear();
  });

  it('should show respondent application details page', async () => {
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: [
        {
          id: '1',
          value: clone(mockRespAppWithClaimantResponse),
        },
      ],
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

    await new RespondentApplicationDetailsController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
  });

  describe('status changes when viewing applications', () => {
    it("changes to viewed when viewing an admin's decision", async () => {
      const userCase: Partial<CaseWithId> = {
        genericTseApplicationCollection: [
          {
            id: '1',
            value: clone(mockRespAppWithDecisionNotViewed),
          },
        ],
      };
      const response = mockResponse();
      const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

      await new RespondentApplicationDetailsController().get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
      expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe('viewed');
    });

    it("changes to in progress when viewing the respondent's application", async () => {
      const userCase: Partial<CaseWithId> = {
        genericTseApplicationCollection: [clone(mockSimpleRespAppTypeItem)],
      };
      const response = mockResponse();
      const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

      await new RespondentApplicationDetailsController().get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
      expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe('inProgress');
    });

    it("changes to in progress when viewing a request for respondent's info", async () => {
      const userCase: Partial<CaseWithId> = {
        genericTseApplicationCollection: [clone(mockRespAppWithRespRequstForInfo)],
      };
      const response = mockResponse();
      const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

      await new RespondentApplicationDetailsController().get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
      expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe('inProgress');
    });

    it("changes to in progress when viewing respondent's provided info after a request", async () => {
      const userCase: Partial<CaseWithId> = {
        genericTseApplicationCollection: [clone(mockRespAppWithRespRequstForInfoAndReply)],
      };
      const response = mockResponse();
      const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

      await new RespondentApplicationDetailsController().get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
      expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe('inProgress');
    });

    it("doesn't change to inProgress when viewing request for information from claimant", async () => {
      const userCase: Partial<CaseWithId> = {
        genericTseApplicationCollection: [clone(mockRespAppWithRespRequstForClaimantInfo)],
      };
      const response = mockResponse();
      const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

      await new RespondentApplicationDetailsController().get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
      expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe(
        'notStartedYet'
      );
    });
  });

  it('should return to main page on axios error to update application state', async () => {
    mockedAxios.put.mockRejectedValueOnce({});

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: [
        {
          id: '1',
          value: clone(mockRespAppWithDecisionNotViewed),
        },
      ],
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

    await new RespondentApplicationDetailsController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_APPLICATIONS);
    expect(request.session.userCase.genericTseApplicationCollection.at(0).value.applicationState).toBe('notViewedYet');
  });

  it.each([
    { name: 'application', url: 'uuid1' },
    { name: 'response', url: 'uuid2' },
    { name: 'decision', url: 'uuid3' },
  ])('should redirect to not found page when $type document cannot be resolved', async args => {
    api.getDocumentDetails = jest
      .fn()
      .mockImplementation(docId =>
        docId === args.url ? documentRejection : Promise.resolve(mockDocumentDetailsResponseData)
      );

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

    const controller = new RespondentApplicationDetailsController();
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
