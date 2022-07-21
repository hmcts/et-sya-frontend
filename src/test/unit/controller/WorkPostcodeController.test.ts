import WorkPostcodeController from '../../../main/controllers/WorkPostcodeController';
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

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
