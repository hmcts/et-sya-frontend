import ApplicationDetailsController from '../../../main/controllers/ApplicationDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import applicationDetails from '../../../main/resources/locales/en/translation/application-details.json';
import common from '../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant Applications Controller', () => {
  const translationJsons = { ...applicationDetails, ...common };
  const t = {
    common: {},
  };

  it('should render the claimant application details page', () => {
    const controller = new ApplicationDetailsController();

    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: [
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
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_DETAILS, expect.anything());
  });
});
