import RepresentedClaimantEnterPostcodeController from '../../../../main/controllers/represented-claimant/RepresentedClaimantEnterPostcodeController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('Represented Claimant Enter Postcode Controller', () => {
  const t = {
    common: {},
  };

  it('should render the Represented Claimant Enter Postcode page', async () => {
    const controller = new RepresentedClaimantEnterPostcodeController();
    const response = mockResponse();
    const request = mockRequest({ t });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.REPRESENTED_CLAIMANT_ENTER_POSTCODE,
      expect.anything()
    );
  });

  describe('post()', () => {
    it("should return a 'required' error when the postcode field is empty", async () => {
      const body = { representedClaimantEnterPostcode: '' };
      const errors = [{ propertyName: 'representedClaimantEnterPostcode', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentedClaimantEnterPostcodeController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it("should return an 'invalid' error when an invalid postcode is entered", async () => {
      const body = { representedClaimantEnterPostcode: 'TESTPOSTCODE' };
      const errors = [{ propertyName: 'representedClaimantEnterPostcode', errorType: 'invalid' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentedClaimantEnterPostcodeController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to the postcode select page on a valid postcode', async () => {
      const body = { representedClaimantEnterPostcode: 'LE5 5HD' };

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentedClaimantEnterPostcodeController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_SELECT_POSTCODE);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save the postcode to userCase on a valid postcode', async () => {
      const body = { representedClaimantEnterPostcode: 'LE5 5HD' };

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentedClaimantEnterPostcodeController().post(req, res);

      expect(req.session.userCase.representedClaimantEnterPostcode).toEqual('LE5 5HD');
    });
  });
});
