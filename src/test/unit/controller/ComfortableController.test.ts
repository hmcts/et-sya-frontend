import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import ComfortableController from '../../../main/controllers/comfortable/ComfortableController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Comfortable Controller', () => {
  const t = {
    comfortable: {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      comfortable: {
        id: 'comfortable',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'comfortable',
            name: 'comfortable',
            value: 'anything',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the "need something to make me feel comfortable" page', () => {
    const controller = new ComfortableController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the "need something to make me feel comfortable" page when errors are present', () => {
      const errors = [{ propertyName: 'comfortable', errorType: 'required' }];
      const body = { comfortable: [''] };

      const controller = new ComfortableController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
