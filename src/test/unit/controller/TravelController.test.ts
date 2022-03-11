import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import TravelController from '../../../main/controllers/travel/TravelController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Travel Controller', () => {
  const t = {
    travel: {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      travel: {
        id: 'travel',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'travel',
            name: 'travel',
            value: 'anything',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the "I need help travelling" page', () => {
    const controller = new TravelController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the "I need help travelling" page when errors are present', () => {
      const errors = [{ propertyName: 'travel', errorType: 'required' }];
      const body = { travel: [''] };

      const controller = new TravelController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
