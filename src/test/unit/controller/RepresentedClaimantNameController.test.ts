import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantNameController from '../../../main/controllers/represented-claimant/RepresentedClaimantNameController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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
        userCase: { representedClaimantName: 'Jane Doe' },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_NAME, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to represented claimant date of birth when name is given', async () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t }, true);
      request.body = { representedClaimantName: 'Jane Doe' };

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH);
    });

    it('should stay on page and error when name is empty', async () => {
      const body = { representedClaimantName: '' };
      const controller = new RepresentedClaimantNameController();
      const request = mockRequestEmpty({ body });
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(
        request.session.errors.some((e: { propertyName: string }) => e.propertyName === 'representedClaimantName')
      ).toBe(true);
    });
  });
});
