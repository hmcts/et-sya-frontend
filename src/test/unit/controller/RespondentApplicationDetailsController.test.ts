import RespondentApplicationDetailsController from '../../../main/controllers/RespondentApplicationDetailsController';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { CLAIMANT, TranslationKeys } from '../../../main/definitions/constants';
import respondentApplicationDetailsRaw from '../../../main/resources/locales/en/translation/respondent-application-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Respondent application details controller', () => {
  it('should show respondent application details page', () => {
    const userCase: Partial<CaseWithId> = {
      genericTseApplicationCollection: [
        {
          id: '1',
          value: {
            applicant: 'Respondent',
            date: '2022-05-05',
            type: 'Amend my claim',
            copyToOtherPartyText: YesOrNo.YES,
            details: 'Help',
            number: '1',
            status: 'notViewedYet',
            dueDate: '2022-05-12',
            applicationState: 'notViewedYet',
            respondCollection: [
              {
                id: '1',
                value: {
                  from: CLAIMANT,
                  date: '20 March 2023',
                  response: 'Response text',
                  copyToOtherParty: YesOrNo.YES,
                },
              },
            ],
          },
        },
      ],
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, respondentApplicationDetailsRaw);

    const controller = new RespondentApplicationDetailsController();

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, expect.anything());
  });
});
