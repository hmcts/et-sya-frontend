import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import AddressDetailsController from '../../../main/controllers/address_details/AddressDetailsController';
// import { CaseWithId } from '../../../main/definitions/case';

describe('Address details Controller', () => {
  const t = {
    'address-details': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      address1: {
        type: 'text',
        id: 'address-line1',
        name: 'address-line1',
        validator: (value: any) => isFieldFilledIn(value),
      },
    },
  } as unknown as FormContent;

  it('should render the Address details controller page', () => {
    const addressDetailsController = new AddressDetailsController(
      mockFormContent,
    );

    const response = mockResponse();
    const userCase = { address1: '10 test street' };
    const request = <AppRequest>mockRequest({ t, userCase });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('address-details');

    addressDetailsController.get(request, response);
    responseMock.verify();
  });

  describe('post()', () => {
    it('should redirect to the same screen when errors are present', () => {
      const errors = [{ propertyName: 'address1', errorType: 'required' }];
      const body = { 'address-line1': '' };

      const controller = new AddressDetailsController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData', () => {
      const body = { address1: '10 test street' };

      const controller = new AddressDetailsController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith('/');
      expect(req.session.userCase).toStrictEqual({
        address1: '10 test street',
      });
    });
  });
});
