import ClaimTypeDiscriminationController from '../../../main/controllers/ClaimTypeDiscriminationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Discrimination Controller', () => {
  const t = {
    'claim-type-discrimination': {},
    common: {},
  };

  it('should render the claim type discrimination page', () => {
    const controller = new ClaimTypeDiscriminationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_DISCRIMINATION, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require input', () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      new ClaimTypeDiscriminationController().post(req, res);

      const expectedErrors = [{ propertyName: 'claimTypeDiscrimination', errorType: 'required' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should assign userCase from the page form data', () => {
      const req = mockRequest({
        body: {
          claimTypeDiscrimination: ['age', 'sex'],
        },
      });
      const res = mockResponse();

      new ClaimTypeDiscriminationController().post(req, res);

      expect(req.session.userCase).toMatchObject({ claimTypeDiscrimination: ['age', 'sex'] });
    });
  });
});
