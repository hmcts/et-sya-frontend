import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import ReasonableAdjustmentsController from '../../../main/controllers/reasonable_adjustments/ReasonableAdjustmentsController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Reasonable Adjustments Controller', () => {
  const t = {
    'reasonable-adjustments': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      reasonableAdjustments: {
        id: 'reasonableAdjustments',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'reasonableAdjustments',
            name: 'reasonableAdjustments',
            value: 'anything',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the Reasonable Adjustments page', () => {
    const controller = new ReasonableAdjustmentsController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the Reasonable Adjustments page when errors are present', () => {
      const errors = [{ propertyName: 'reasonableAdjustments', errorType: 'required' }];
      const body = { reasonableAdjustments: [''] };

      const controller = new ReasonableAdjustmentsController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
