import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantEnterEmailController from '../../../../main/controllers/represented-claimant/RepresentedClaimantEnterEmailController';
import { YesOrNo } from '../../../../main/definitions/case';
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

    it('should NOT populate the email on first load when it has not been explicitly provided', async () => {
      const controller = new RepresentedClaimantEnterEmailController();
      const response = mockResponse();
      // Email is seeded from the claimant record but the flag is not set.
      const request = mockRequest({ t, userCase: { representedClaimantEmail: 'seeded@claimant.com' } });

      await controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.userCase.representedClaimantEmail).toBeUndefined();
    });

    it('should populate the email once it has been explicitly provided', async () => {
      const controller = new RepresentedClaimantEnterEmailController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { representedClaimantEmail: 'entered@claimant.com', representedClaimantEmailProvided: YesOrNo.YES },
      });

      await controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.userCase.representedClaimantEmail).toEqual('entered@claimant.com');
    });

    it('should not mutate the stored case when suppressing the seeded email', async () => {
      const controller = new RepresentedClaimantEnterEmailController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { representedClaimantEmail: 'seeded@claimant.com' } });

      await controller.get(request, response);

      expect(request.session.userCase.representedClaimantEmail).toEqual('seeded@claimant.com');
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

    it('should flag the email as provided when a value is submitted', async () => {
      const body = { representedClaimantEmail: 'claimant@example.com' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.representedClaimantEmailProvided).toEqual(YesOrNo.YES);
    });

    it('should flag the email as not provided when submitted blank', async () => {
      const body = { representedClaimantEmail: '   ' };
      const controller = new RepresentedClaimantEnterEmailController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.representedClaimantEmailProvided).toEqual(YesOrNo.NO);
    });
  });
});
