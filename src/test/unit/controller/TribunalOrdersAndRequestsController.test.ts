import axios, { AxiosResponse } from 'axios';

import { TribunalOrdersAndRequestsController } from '../../../main/controllers/TribunalOrdersAndRequestsController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal orders and requests Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');

  const notificationItems: SendNotificationTypeItem[] = [
    {
      value: {
        sendNotificationCaseManagement: 'Case management order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    },
    {
      value: {
        sendNotificationCaseManagement: 'Request',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    },
    {
      value: {
        sendNotificationCaseManagement: 'Case management order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ECC,
      } as SendNotificationType,
    },
  ];

  jest.mock('axios');
  const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
  caseApi.getUserCase = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          sendNotificationCollection: notificationItems,
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  const mockClient = jest.spyOn(CaseService, 'getCaseApi');
  mockClient.mockReturnValue(caseApi);

  const user: UserDetails = {
    accessToken: 'token',
    id: '1234',
    email: 'bobby@gmail.com',
    givenName: 'Bobby',
    familyName: 'Ryan',
    isCitizen: true,
  };

  it('should render tribunal orders and requests page with ECC flag', async () => {
    mockLdClient.mockResolvedValue(true);

    const tribunalOrdersAndRequestsController = new TribunalOrdersAndRequestsController();
    const request = mockRequest({});
    request.session.user = user;
    const response = mockResponse();

    await tribunalOrdersAndRequestsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTIFICATIONS, expect.anything());
  });

  it('should render tribunal orders and requests page without ECC flag', async () => {
    mockLdClient.mockResolvedValue(false);

    const tribunalOrdersAndRequestsController = new TribunalOrdersAndRequestsController();
    const request = mockRequest({});
    request.session.user = user;
    const response = mockResponse();

    await tribunalOrdersAndRequestsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTIFICATIONS, expect.anything());
  });
});
