import RepresentedClaimantNameController from '../../../main/controllers/represented-claimant/RepresentedClaimantNameController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  ...jest.requireActual('../../../main/controllers/helpers/CaseHelpers'),
  handleUpdateDraftCase: jest.fn(() => Promise.resolve()),
}));

describe('RepresentedClaimantNameController', () => {
  const t = {
    'represented-claimant-name': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the represented claimant name page', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_NAME, expect.anything());
    });

    it('should pre-populate form with existing represented claimant name from session', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_NAME, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to represented claimant date of birth when name is given', async () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' };

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH);
    });

    it('should stay on page and error when name is empty', async () => {
      const body = { representedClaimantFirstName: '', representedClaimantLastName: '' };
      const controller = new RepresentedClaimantNameController();
      const request = mockRequestEmpty({ body });
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(
        request.session.errors.some((e: { propertyName: string }) => e.propertyName === 'representedClaimantFirstName')
      ).toBe(true);
      expect(
        request.session.errors.some((e: { propertyName: string }) => e.propertyName === 'representedClaimantLastName')
      ).toBe(true);
    });
  });
});
