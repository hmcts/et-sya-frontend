import { isFieldFilledIn } from '../../../main/components/form/validator';
import ReturnToExistingController from '../../../main/controllers/return_to_existing_claim/ReturnToExistingController';
import { YesOrNo } from '../../../main/definitions/case';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Return To Existing Controller', () => {
  const t = {
    'return-to-claim': {},
    common: {},
  };

  const mockedFormContent = {
    fields: {
      returnToExisting: {
        id: 'return_number_or_account',
        type: 'radios',
        classes: 'govuk-date-input',
        label: 'select',
        labelHidden: true,
        values: [
          {
            name: 'have_return_number',
            label: 'I have a return number',
            selected: false,
            value: 'Yes',
          },
          {
            name: 'have_account',
            label: 'I have an account',
            selected: false,
            value: 'Yes',
          },
        ],
        validator: isFieldFilledIn,
      },
    },
  } as unknown as FormContent;

  it('should render the return to claim page', () => {
    const controller = new ReturnToExistingController(mockedFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('return-to-claim', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'returnToExisting', errorType: 'required' }];
    const body = { returnToExisting: '' };
    const controller = new ReturnToExistingController(mockedFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = { returnToExisting: YesOrNo.YES };
    const controller = new ReturnToExistingController(mockedFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
    expect(req.session.errors).toEqual([]);
  });
});
