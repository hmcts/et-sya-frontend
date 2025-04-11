import HearingDetailsController from '../../../main/controllers/HearingDetailsController';
import { Parties, TranslationKeys } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import citizenHubTranslation from '../../../main/resources/locales/en/translation/citizen-hub.json';
import hearingDetailsTranslation from '../../../main/resources/locales/en/translation/hearing-details.json';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing details controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const translations = { ...citizenHubTranslation, ...hearingDetailsTranslation };

  it('should render the hearing details page', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translations);
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.sendNotificationCollection = [
      {
        id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
        value: {
          sendNotificationNotify: Parties.BOTH_PARTIES,
          sendNotificationSubject: ['Hearing'],
          sendNotificationSelectHearing: {
            selectedCode: '123abc',
          },
          notificationState: HubLinkStatus.VIEWED,
        },
      },
    ];

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetailsCollection: [
          {
            hearingNumber: '3333',
            Hearing_type: 'Hearing',
            hearingDateRows: [
              {
                date: new Date('2028-07-04T14:00:00.000'),
                status: 'Listed',
                venue: 'Field House',
              },
            ],
            notifications: [
              {
                displayStatus: 'Viewed',
                id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
                redirectUrl: '/tribunal-order-or-request-details/daeade9a-52df-48f6-9ef8-4eb210dac9e3',
                statusColor: '--green',
                value: {
                  notificationState: HubLinkStatus.VIEWED,
                  sendNotificationNotify: Parties.BOTH_PARTIES,
                  sendNotificationSelectHearing: { selectedCode: '123abc' },
                  sendNotificationSubject: ['Hearing'],
                },
              },
            ],
          },
        ],
      })
    );
  });

  it('should render the hearing details page without notification', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translations);
    request.session.userCase.hearingCollection = mockHearingCollection;

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetailsCollection: [
          {
            hearingNumber: '3333',
            Hearing_type: 'Hearing',
            hearingDateRows: [
              {
                date: new Date('2028-07-04T14:00:00.000'),
                status: 'Listed',
                venue: 'Field House',
              },
            ],
            notifications: [],
          },
        ],
      })
    );
  });

  it('should render the hearing details page without hearing', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translations);

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetailsCollection: [],
      })
    );
  });
});
