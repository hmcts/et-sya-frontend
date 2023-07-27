import RespondentApplicationsController from '../../../main/controllers/RespondentApplicationsController';
import * as translateTypesOfClaim from '../../../main/controllers/helpers/ApplicationTableRecordTranslationHelper';
import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Respondent Applications Controller', () => {
  it('should render respondent applications page', async () => {
    const application = {
      id: '124',
      value: {
        number: '1',
        applicationState: 'notStartedYet',
        applicant: 'Respondent',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        type: 'amend',
        status: 'Open',
        dueDate: '2023-05-07',
        date: '2023-05-01',
      },
    } as GenericTseApplicationTypeItem;

    const request = mockRequest({});
    request.session.userCase.genericTseApplicationCollection = [application];
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const response = mockResponse();

    const mockHelper = jest.spyOn(translateTypesOfClaim, 'translateTypeOfClaim');
    mockHelper.mockReturnValue(undefined);

    const respondentApplicationsController = new RespondentApplicationsController();
    await respondentApplicationsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_APPLICATIONS, expect.anything());
  });
});
