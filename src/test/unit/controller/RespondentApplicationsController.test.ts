import axios, { AxiosResponse } from 'axios';

import RespondentApplicationsController from '../../../main/controllers/RespondentApplicationsController';
import * as translateTypesOfClaim from '../../../main/controllers/helpers/ApplicationTableRecordTranslationHelper';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Respondent Applications Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should render respondent applications page', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );

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
