import RespondToApplicationController from '../../../main/controllers/RespondToApplicationController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/respond-to-application.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to application Controller', () => {
  const translationJsons = { ...respondJsonRaw, ...common };
  const t = {
    common: {},
  };

  it('should render the Respond to application page', () => {
    const controller = new RespondToApplicationController();

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: [
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
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION, expect.anything());
  });
});
