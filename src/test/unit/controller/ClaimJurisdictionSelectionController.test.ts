import ClaimJurisdictionSelectionController from '../../../main/controllers/ClaimJurisdictionSelectionController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Jurisdiction Selection Controller', () => {
  const t = {
    'claim-jurisdiction-selection': {},
    common: {},
  };

  it('should render the Work Postcode page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new ClaimJurisdictionSelectionController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('job-title', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the postcode field is empty", () => {
      const body = {
        workPostcode: '',
      };
      const errors = [{ propertyName: 'workPostcode', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new ClaimJurisdictionSelectionController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should render the next page when a mvp postcode is given', () => {
      const mvpPostCode = 'G44 5TY';
      const body = { workPostcode: mvpPostCode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new ClaimJurisdictionSelectionController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE);
    });

    it('should render the next page when a valid postcode is given', () => {
      const postcode = 'LA1 1YN'; // Lancaster
      const body = { workPostcode: postcode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new ClaimJurisdictionSelectionController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE);
    });
  });
});
