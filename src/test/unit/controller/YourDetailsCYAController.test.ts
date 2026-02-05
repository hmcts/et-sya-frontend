import YourDetailsCYAController from '../../../main/controllers/YourDetailsCYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import yourDetailsCyaRaw from '../../../main/resources/locales/en/translation/your-details-cya.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('YourDetailsCYAController', () => {
  const translationJsons = { ...yourDetailsCyaRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render the Check and submit page', async () => {
    const controller = new YourDetailsCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_DETAILS_CYA, expect.anything());
  });

  it('should include cancelPage in render context', async () => {
    const controller = new YourDetailsCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_DETAILS_CYA,
      expect.objectContaining({
        cancelPage: expect.any(String),
      })
    );
  });

  it('should include welshEnabled flag in render context', async () => {
    const controller = new YourDetailsCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_DETAILS_CYA,
      expect.objectContaining({
        welshEnabled: true,
      })
    );
  });

  it('should include userCase in render context', async () => {
    const controller = new YourDetailsCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.YOUR_DETAILS_CYA,
      expect.objectContaining({
        userCase: expect.any(Object),
      })
    );
  });
});
