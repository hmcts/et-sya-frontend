import ContactTheTribunalCYAController from '../../../main/controllers/ContactTheTribunalCYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import common from '../../../main/resources/locales/en/translation/common.json';
import contactTribCyaTranslation from '../../../main/resources/locales/en/translation/contact-the-tribunal-cya.json';
import contactTribTranslation from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Contact Application Check Your Answers Controller', () => {
  const translationJsons = { ...common, ...contactTribCyaTranslation, ...contactTribTranslation };

  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);

  it('should render contact application CYA page', async () => {
    const controller = new ContactTheTribunalCYAController();
    const res = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase = userCaseWithRespondent;
    request.session.visitedContactTribunalSelection = true;
    request.get = jest.fn();

    request.session.userCase.contactApplicationType = 'withdraw';

    await controller.get(request, res);

    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, expect.anything());
  });
});
