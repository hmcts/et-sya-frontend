import HearingDetailsController from '../../../main/controllers/HearingDetailsController';
import { Parties, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document File controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const t = {
    common: {},
  };

  it('should render the hearing details page', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
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
        },
      },
    ];

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetails: [
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
                id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
                value: {
                  sendNotificationNotify: 'Both parties',
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
    const request = mockRequest({ t });
    request.session.userCase.hearingCollection = mockHearingCollection;

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetails: [
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
    const request = mockRequest({ t });

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingDetails: [],
      })
    );
  });
});
