import axios from 'axios';

import RespondToTribunalResponseController from '../../../main/controllers/RespondToTribunalResponseController';
import * as routerHelpers from '../../../main/controllers/helpers/RouterHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/respond-to-application.json';
import * as CaseService from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { safeUrlMock } from '../mocks/mockUrl';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('axios');
const caseApi = new CaseService.CaseApi(axios as jest.Mocked<typeof axios>);
const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);
const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
mockLdClient.mockResolvedValue(true);

describe('Respond to tribunal response Controller', () => {
  const translationJsons = { ...respondJsonRaw, ...common };
  const t = {
    'respond-to-application': {},
    common: {},
  };

  jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(safeUrlMock);

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
    userCase.genericTseApplicationCollection = mockGenericTseCollection.slice(0, 1);
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
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
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
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respondent-supporting-material/1?lng=en');
  });

  it('should return same page on error', async () => {
    const body = {
      responseText: 'some Text',
    };
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respond-to-tribunal-response/1?lng=en');
  });

  it('should redirect error page when genericTseApplicationCollection not found', async () => {
    const body = {
      responseText: 'some Text',
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToTribunalResponseController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });

  it('should redirect error page when appId invalid', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase: mockUserCase }, translationJsons);
    request.params.appId = 'invalid-app-id';

    await new RespondToTribunalResponseController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });
});
