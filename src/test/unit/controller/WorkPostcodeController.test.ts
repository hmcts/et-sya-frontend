import WorkPostcodeController from '../../../main/controllers/WorkPostcodeController';
import { LegacyUrls, PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Work Postcode Controller', () => {
  const t = {
    'work-postcode': {},
    common: {},
  };

  it('should render the Work Postcode page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new WorkPostcodeController().get(request, response);

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
      new WorkPostcodeController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should render the next page when a mvp postcode is given', () => {
      const mvpPostCode = 'G44 5TY';
      const body = { workPostcode: mvpPostCode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new WorkPostcodeController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE);
    });

    it('should render the legacy ET1 service when a non mvp location is given', () => {
      const notMvpPostCode = 'SW4 9HW';
      const body = { workPostcode: notMvpPostCode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new WorkPostcodeController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1);
    });
  });
});
