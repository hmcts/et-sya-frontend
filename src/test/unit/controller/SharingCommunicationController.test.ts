import SharingCommunicationController from '../../../main/controllers/SharingCommunicationController';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import sharingCommunicationRaw from '../../../main/resources/locales/en/translation/sharing-communication.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('SharingCommunicationController', () => {
  const t = {
    'sharing-communication': {},
    common: {},
  };
  const translationJsons = { ...sharingCommunicationRaw };

  beforeAll(async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
  });

  describe('GET', () => {
    it('should render sharing-communication view for unrepresented claimant', async () => {
      const controller = new SharingCommunicationController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({ t }, translationJsons);
      request.session.userCase.contactApplicationType = 'withdraw';

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.SHARING_COMMUNICATION,
        expect.objectContaining({
          cancelUrl: PageUrls.CONTACT_THE_TRIBUNAL + languages.ENGLISH_URL_PARAMETER,
          postUrl: PageUrls.SHARING_COMMUNICATION + languages.ENGLISH_URL_PARAMETER,
        })
      );
    });

    it('should set contactApplicationType if selectedOption query parameter is passed', async () => {
      const controller = new SharingCommunicationController();
      const response = mockResponse();
      const request = mockRequestWithTranslation({ t }, translationJsons);
      request.query = { selectedOption: 'amend' };

      await controller.get(request, response);

      expect(request.session.userCase.contactApplicationType).toBe('amend');
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.SHARING_COMMUNICATION, expect.anything());
    });

    it('should redirect to NOT_FOUND if claimant is represented by organisation', async () => {
      const controller = new SharingCommunicationController();
      const response = mockResponse();
      const request = mockRequest({
        userCase: {
          claimantRepresentedQuestion: YesOrNo.YES,
          claimantRepresentativeOrganisationPolicy: {
            Organisation: {
              OrganisationID: 'ORG123',
            },
          },
        },
      });

      await controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should set confirmed flag in session and redirect to selected application url', async () => {
      const controller = new SharingCommunicationController();
      const response = mockResponse();
      const request = mockRequest({
        userCase: {
          contactApplicationType: 'withdraw',
        },
      });

      await controller.post(request, response);

      expect(request.session.contactTribunalSharingCommunicationConfirmed).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith('/contact-the-tribunal/withdraw?lng=en');
    });

    it('should redirect to PREPARE_DOCUMENTS when contactApplicationType is documents', async () => {
      const controller = new SharingCommunicationController();
      const response = mockResponse();
      const request = mockRequest({
        userCase: {
          contactApplicationType: 'documents',
        },
      });

      await controller.post(request, response);

      expect(request.session.contactTribunalSharingCommunicationConfirmed).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.PREPARE_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
