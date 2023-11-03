import RespondToApplicationController from '../../../main/controllers/RespondToApplicationController';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/respond-to-application.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';

describe('Respond to application Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const translationJsons = { ...respondJsonRaw, ...common };
  const t = {
    'respond-to-application': {},
    common: {},
  };

  it('should render the Respond to application page', async () => {
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

  it('should render the Rule 92 page', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
  });

  it('should render the add supporting material page', async () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.YES,
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respondent-supporting-material/1?lng=en');
  });

  it('should return same page on error', async () => {
    const body = {
      responseText: 'some Text',
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondToApplicationController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith('/respond-to-application/1?lng=en');
  });
});
