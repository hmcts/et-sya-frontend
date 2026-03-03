import YourDetailsCYAController from '../../../main/controllers/YourDetailsCYAController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, ServiceErrors, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import yourDetailsCyaRaw from '../../../main/resources/locales/en/translation/your-details-cya.json';
import { getCaseApi } from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/services/CaseService');
const mockGetCaseApi = getCaseApi as jest.Mock;

describe('YourDetailsCYAController', () => {
  const translationJsons = { ...yourDetailsCyaRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  beforeAll(() => {
    mockGetCaseApi.mockReturnValue({
      assignCaseUserRole: jest.fn().mockResolvedValue({ data: {} }),
    });
  });

  describe('get()', () => {
    it('should render the Check and submit page', async () => {
      const controller = new YourDetailsCYAController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({}, translationJsons);
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_DETAILS_CYA, expect.anything());
    });

    it('should include cancelLink in render context', async () => {
      const controller = new YourDetailsCYAController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({}, translationJsons);
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_DETAILS_CYA,
        expect.objectContaining({
          cancelLink: expect.any(String),
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

    it('should include respondentNames from session in render context', async () => {
      const controller = new YourDetailsCYAController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({}, translationJsons);
      request.session.respondentNames = ['Respondent One', 'Respondent Two'];
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_DETAILS_CYA,
        expect.objectContaining({
          respondentNames: ['Respondent One', 'Respondent Two'],
        })
      );
    });

    it('should default respondentNames to empty array when not set', async () => {
      const controller = new YourDetailsCYAController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({}, translationJsons);
      delete (request.session as any).respondentNames;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_DETAILS_CYA,
        expect.objectContaining({
          respondentNames: [],
        })
      );
    });

    it('should include sessionErrors in render context defaulting to empty array', async () => {
      const controller = new YourDetailsCYAController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({}, translationJsons);
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_DETAILS_CYA,
        expect.objectContaining({
          sessionErrors: [],
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

    it('should redirect to claimant applications when yourDetailsCya value is Yes', async () => {
      const body = { yourDetailsCya: YesOrNo.YES };
      const userCase = { id: '1234', claimantName: 'Test User', respondentName: 'Test Company' };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body, userCase });
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS + '?lng=en');
    });

    it('should redirect with caseAlreadyAssignedToSameUser error when user already has role', async () => {
      mockGetCaseApi.mockReturnValueOnce({
        assignCaseUserRole: jest
          .fn()
          .mockRejectedValue(
            new Error(
              `Some prefix ${ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE} suffix`
            )
          ),
      });
      const body = { yourDetailsCya: YesOrNo.YES };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.session.errors = [];
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'caseAlreadyAssignedToSameUser' }])
      );
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
    });

    it('should redirect with caseAlreadyAssigned error when case already assigned to another user', async () => {
      mockGetCaseApi.mockReturnValueOnce({
        assignCaseUserRole: jest
          .fn()
          .mockRejectedValue(
            new Error(`Some prefix ${ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE} suffix`)
          ),
      });
      const body = { yourDetailsCya: YesOrNo.YES };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.session.errors = [];
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'caseAlreadyAssigned' }])
      );
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
    });

    it('should redirect with generic api error when assignCaseUserRole throws an unrecognised error', async () => {
      mockGetCaseApi.mockReturnValueOnce({
        assignCaseUserRole: jest.fn().mockRejectedValue(new Error('Unexpected server failure')),
      });
      const body = { yourDetailsCya: YesOrNo.YES };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.session.errors = [];
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'api' }])
      );
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
    });

    it('should redirect with api error when caseAssignmentResponse.data is null', async () => {
      mockGetCaseApi.mockReturnValueOnce({
        assignCaseUserRole: jest.fn().mockResolvedValue({ data: null }),
      });
      const body = { yourDetailsCya: YesOrNo.YES };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.session.errors = [];
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'api' }])
      );
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
    });

    it('should redirect with api error when caseAssignmentResponse is undefined', async () => {
      mockGetCaseApi.mockReturnValueOnce({
        assignCaseUserRole: jest.fn().mockResolvedValue(undefined),
      });
      const body = { yourDetailsCya: YesOrNo.YES };
      const controller = new YourDetailsCYAController();
      const request = mockRequest({ body });
      request.session.errors = [];
      request.url = PageUrls.YOUR_DETAILS_CYA;
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'api' }])
      );
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
    });
  });
});
