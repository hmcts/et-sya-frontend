import axios from 'axios';

import RespondToTribunalResponseController from '../../../main/controllers/RespondToTribunalResponseController';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/respond-to-application.json';
import * as CaseService from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseService.CaseApi(axios as jest.Mocked<typeof axios>);
const documentRejection = Promise.reject(new Error('Mocked failure to get document metadata'));
const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('Respond to tribunal response Controller', () => {
  const translationJsons = { ...respondJsonRaw, ...common };
  const t = {
    'respond-to-application': {},
    common: {},
  };

  it('should render the Respond to Tribunal response page for respondent application', async () => {
    const controller = new RespondToTribunalResponseController();
    const tseAppCollection = [
      {
        id: '1',
        value: {
          applicant: 'Respondent',
          date: '2022-05-05',
          type: 'Amend my claim',
          copyToOtherPartyText: 'Yes',
          details: 'Help',
          number: '1',
          status: 'notViewedYet',
          dueDate: '2022-05-12',
          applicationState: 'notViewedYet',
        },
      },
    ];
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: tseAppCollection,
      selectedGenericTseApplication: tseAppCollection[0],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE, expect.anything());
  });

  it('should render the Respond to Tribunal response page for claimant application', async () => {
    const controller = new RespondToTribunalResponseController();
    const tseAppCollection = [
      {
        id: '1',
        value: {
          applicant: 'Claimant',
          date: '2022-05-05',
          type: 'Amend my claim',
          copyToOtherPartyText: 'Yes',
          details: 'Help',
          number: '1',
          status: 'notViewedYet',
          dueDate: '2022-05-12',
          applicationState: 'notViewedYet',
        },
      },
    ];
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: tseAppCollection,
      selectedGenericTseApplication: tseAppCollection[0],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE, expect.anything());
  });

  it('should render the Rule 92 page on continue', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();
    const userCase = request.session.userCase;
    userCase.respondents = [
      {
        ccdId: '1',
      },
    ];
    userCase.representatives = [
      {
        respondentId: '1',
        hasMyHMCTSAccount: YesOrNo.YES,
      },
    ];

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
  });

  it('should render the Rule 92 page on continue with non system user', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party-not-system-user?lng=en');
  });

  it('should render the add supporting material page', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.YES,
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respondent-supporting-material/1?lng=en');
  });

  it('should return same page on error', async () => {
    const body = {
      responseText: 'some Text',
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respond-to-tribunal-response/1?lng=en');
  });

  it('should redirect to not found page when response document cannot be resolved', async () => {
    caseApi.getDocumentDetails = jest.fn().mockReturnValue(documentRejection);

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);

    const controller = new RespondToTribunalResponseController();
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
