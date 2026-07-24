import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantEnterEmailController from '../../../../main/controllers/represented-claimant/RepresentedClaimantEnterEmailController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Represented Claimant Enter Email Controller', () => {
  const t = {
    common: {},
    'represented-claimant-enter-email': {},
  };

  describe('get()', () => {
    it('should render the represented claimant enter email page', async () => {
      const controller = new RepresentedClaimantEnterEmailController();
      const response = mockResponse();
      const request = mockRequest({ t });

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to represented claimant details check when email is provided', async () => {
      const body = { representedClaimantEmail: 'claimant@example.com' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to represented claimant details check when email is blank', async () => {
      const body = { representedClaimantEmail: '' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should return an invalid error when email format is not valid', async () => {
      const body = { representedClaimantEmail: 'not-an-email' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'representedClaimantEmail', errorType: 'invalid' }])
      );
    });

    it('should save represented claimant email to userCase', async () => {
      const body = { representedClaimantEmail: 'claimant@example.com' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.representedClaimantEmail).toEqual('claimant@example.com');
    });
  });
});
