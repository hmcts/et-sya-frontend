import { atLeastOneFieldIsChecked } from '../../../main/components/form/validator';
import CommunicatingController from '../../../main/controllers/communicating/CommunicatingController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Communicating Controller', () => {
  const t = {
    communicating: {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      communicating: {
        id: 'communicating',
        type: 'checkboxes',
        labelHidden: true,
        validator: jest.fn(atLeastOneFieldIsChecked),
        values: [
          {
            id: 'communicating',
            name: 'communicating',
            value: 'anything',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the "I need help communicating" page', () => {
    const controller = new CommunicatingController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the "I need help communicating" page when errors are present', () => {
      const errors = [{ propertyName: 'communicating', errorType: 'required' }];
      const body = { communicating: [''] };

      const controller = new CommunicatingController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
