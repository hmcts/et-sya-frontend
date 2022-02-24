import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import TypeOfClaimController from '../../../main/controllers/type_of_claim/TypeOfClaimController';
import { AuthUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Type Of Claim Controller', () => {
  const t = {
    'type-of-claim': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      typeOfClaim: {
        id: 'typeOfClaim',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'typeOfClaim',
            name: 'typeOfClaim',
            value: TypesOfClaim.BREACH_OF_CONTRACT,
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the Type Of Claim controller page', () => {
    const typeOfController = new TypeOfClaimController(mockFormContent);

    const response = mockResponse();
    const userCase = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
    const request = mockRequest({ t, userCase });

    typeOfController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_CLAIM, expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to Type of Claim page when errors are present', () => {
      const errors = [{ propertyName: 'typeOfClaim', errorType: 'required' }];
      const body = { typesOfClaim: [''] };

      const controller = new TypeOfClaimController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Type of Claim', () => {
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };

      const controller = new TypeOfClaimController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(AuthUrls.LOGIN);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: TypesOfClaim.BREACH_OF_CONTRACT,
      });
    });
  });
});
