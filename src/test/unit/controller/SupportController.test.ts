import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import SupportController from '../../../main/controllers/support/SupportController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Support Controller', () => {
  const t = {
    support: {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      support: {
        id: 'support',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'support',
            name: 'support',
            value: 'anything',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the "I need support" page', () => {
    const controller = new SupportController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the "I need support" page when errors are present', () => {
      const errors = [{ propertyName: 'support', errorType: 'required' }];
      const body = { support: [''] };

      const controller = new SupportController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
