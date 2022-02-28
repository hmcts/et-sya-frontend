import { isFieldFilledIn } from '../../../main/components/form/validator';
import pastEmployerController from '../../../main/controllers/past_employer/PastEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Past Employer Controller', () => {
  const t = {
    'past-employer': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      updatePreference: {
        classes: 'govuk-radios',
        id: 'past-employer',
        type: 'radios',
        values: [
          {
            name: 'radio1',
            label: 'radio1',
            value: '',
            attributes: { maxLength: 2 },
          },
          {
            name: 'radio1',
            label: 'radio2',
            value: '',
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
  } as unknown as FormContent;

  it('should render the Update Preference page', () => {
    const controller = new pastEmployerController(mockFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('past-employer', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'updatePreference', errorType: 'required' }];
    const body = { 'past-employer': '' };

    const controller = new pastEmployerController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
