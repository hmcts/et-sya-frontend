import RespondToApplicationController from '../../../main/controllers/RespondToApplicationController';
import * as routerHelpers from '../../../main/controllers/helpers/RouterHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { Rule92Types, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/respond-to-application.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { safeUrlMock } from '../mocks/mockUrl';

describe('Respond to application Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const translationJsons = { ...respondJsonRaw, ...common };
  const t = {
    'respond-to-application': {},
    common: {},
  };

  jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(safeUrlMock);

  it('should render the Respond to application page', async () => {
    const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockClient.mockResolvedValue(true);
    const controller = new RespondToApplicationController();
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
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION, expect.anything());
  });

  it('should set contactType and visitedContactTribunalSelection on GET request', async () => {
    const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockClient.mockResolvedValue(true);
    const controller = new RespondToApplicationController();
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
    expect(request.session.contactType).toBe(Rule92Types.RESPOND);
    expect(request.session.visitedContactTribunalSelection).toBe(true);
  });

  it('should redirect to copy-to-other-party when respondent is system user and hasSupportingMaterial is NO', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
      respondents: [
        {
          ccdId: '1',
        },
      ],
      representatives: [
        {
          respondentId: '1',
          hasMyHMCTSAccount: YesOrNo.YES,
        },
      ],
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
  });

  it('should redirect to copy-to-other-party-not-system-user when respondent is not system user and hasSupportingMaterial is NO', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: mockGenericTseCollection.slice(0, 1),
      respondents: [
        {
          ccdId: '1',
        },
      ],
      representatives: [
        {
          respondentId: '1',
          hasMyHMCTSAccount: YesOrNo.NO,
        },
      ],
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
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

    const controller = new RespondToApplicationController();
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

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respond-to-application/1?lng=en');
  });

  it('should redirect error page when genericTseApplicationCollection not found', async () => {
    const body = {
      responseText: 'some Text',
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });
});
