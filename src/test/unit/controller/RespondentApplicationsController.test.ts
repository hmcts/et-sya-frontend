import RespondentApplicationsController from '../../../main/controllers/RespondentApplicationsController';
import * as translateTypesOfClaim from '../../../main/controllers/helpers/ApplicationTableRecordTranslationHelper';
import * as caseSelectionService from '../../../main/controllers/helpers/PageContentHelpers';
import { TranslationKeys } from '../../../main/definitions/constants';
import { RespondentApplicationDetails } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const getRespondentAppMock = jest.spyOn(caseSelectionService, 'getRespondentApplicationDetails');

describe('Respondent Applications Controller', () => {
  const respondentApplications: RespondentApplicationDetails[] = [
    {
      respondentApplicationHeader: 'The respondent has applied to amend response',
      respondToRespondentAppRedirectUrl: '/respondent-application-details/1?lng=en',
      copyToOtherPartyYesOrNo: 'Yes',
      applicationType: 'A',
      number: '1',
    },
    {
      respondentApplicationHeader: 'The respondent has applied to change personal details',
      respondToRespondentAppRedirectUrl: '/respondent-application-details/2?lng=en',
      copyToOtherPartyYesOrNo: 'Yes',
      applicationType: 'B',
      number: '2',
    },
  ];

  it('should render respondent applications page', async () => {
    getRespondentAppMock.mockReturnValue(respondentApplications);
    const respondentApplicationsController = new RespondentApplicationsController();
    const request = mockRequest({});
    const response = mockResponse();
    const mockHelper = jest.spyOn(translateTypesOfClaim, 'translateTypeOfClaim');
    mockHelper.mockReturnValue(undefined);

    await respondentApplicationsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATIONS, expect.anything());
  });
});
