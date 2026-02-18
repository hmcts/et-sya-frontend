import YourDetailsCYAController from '../../../main/controllers/YourDetailsCYAController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import yourDetailsCyaRaw from '../../../main/resources/locales/en/translation/your-details-cya.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('YourDetailsCYAController', () => {
  const translationJsons = { ...yourDetailsCyaRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  describe('get()', () => {
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

  describe('post()', () => {
    it("should return a 'required' error when the yourDetailsCya field is empty", async () => {
      const body = { yourDetailsCya: '' };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
      expect(request.session.errors).toEqual([{ propertyName: 'yourDetailsCya', errorType: 'required' }]);
    });

    it('should redirect to citizen hub when yourDetailsCya value is Yes', async () => {
      const body = { yourDetailsCya: YesOrNo.YES };
      const userCase = { id: '1234', claimantName: 'Test User', respondentName: 'Test Company' };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body, userCase });
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CITIZEN_HUB.replace(':caseId', '1234'));
    });
  });
});
