import HearingDetailsController from '../../../main/controllers/HearingDetailsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockHearingCollectionFutureDates } from '../mocks/mockHearing';
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
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;

    const controller = new HearingDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_DETAILS,
      expect.objectContaining({
        hearingCollection: request.session.userCase.hearingCollection,
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
        hearingCollection: request.session.userCase.hearingCollection,
      })
    );
  });
});
