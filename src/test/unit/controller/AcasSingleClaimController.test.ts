import AcasSingleClaimController from '../../../main/controllers/AcasSingleClaimController';
import { YesOrNo } from '../../../main/definitions/case';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Acas single claim Controller', () => {
  const t = {
    'acas-single-claim': {},
    common: {},
  };

  it('should render the Acas Single Claim controller page', () => {
    const acasSingleClaimController = new AcasSingleClaimController();

    const response = mockResponse();
    const userCase = { isAcasSingle: YesOrNo.YES };
    const request = mockRequest({ t, userCase });

    acasSingleClaimController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('acas-single-claim', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to Acas Single Claim page when errors are present', () => {
      const errors = [{ propertyName: 'isAcasSingle', errorType: 'required' }];
      const body = { isAcasSingle: '' };

      const controller = new AcasSingleClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Acas Single', () => {
      const body = { isAcasSingle: YesOrNo.YES };

      const controller = new AcasSingleClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith('/type-of-claim');
      expect(req.session.userCase).toStrictEqual({
        isAcasSingle: YesOrNo.YES,
      });
    });
  });
});
