import { mock } from 'sinon';

import { isValidUKTelNumber } from '../../../main/components/form/validator';
import TelNumberController from '../../../main/controllers/tel_number/TelNumberController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Telephone number Controller', () => {
  const t = {
    'telephone-number': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      telNumber: {
        type: 'tel',
        id: 'telephone-number',
        name: 'telephone-number',
        validator: (value: never) => isValidUKTelNumber(value),
      },
    },
  } as unknown as FormContent;

  it('should render the Address details controller page', () => {
    const telNumberController = new TelNumberController(mockFormContent);

    const response = mockResponse();
    const userCase = { telNumber: '01234567890' };
    const request = <AppRequest>mockRequest({ t, userCase });

    const responseMock = mock(response);

    responseMock.expects('render').once().withArgs('telephone-number');

    telNumberController.get(request, response);
    responseMock.verify();
  });

  describe('post()', () => {
    it('should redirect to the same screen when errors are present', () => {
      const errors = [{ propertyName: 'telNumber', errorType: 'invalid' }];
      const body = { telNumber: 'not valid' };

      const controller = new TelNumberController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData', () => {
      const body = { telNumber: '01234567890' };

      const controller = new TelNumberController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.UPDATE_PREFERENCES);
      expect(req.session.userCase).toStrictEqual({
        telNumber: '01234567890',
      });
    });
  });
});
