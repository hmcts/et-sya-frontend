import RepresentedClaimantDetailsCheckController from '../../../../main/controllers/represented-claimant/RepresentedClaimantDetailsCheckController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('Represented Claimant Details Check Controller', () => {
  const t = {
    common: {},
    'represented-claimant-details-check': {},
  };

  describe('get()', () => {
    it('should render the represented claimant details check page', async () => {
      const controller = new RepresentedClaimantDetailsCheckController();
      const response = mockResponse();
      const request = mockRequest({ t });

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.REPRESENTED_CLAIMANT_DETAILS_CHECK,
        expect.anything()
      );
    });
  });

  describe('post()', () => {
    it('should redirect to representative comms preference', () => {
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ t });
      const res = mockResponse();

      controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_COMMS_PREFERENCE);
    });
  });
});
