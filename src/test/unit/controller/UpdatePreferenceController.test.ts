import sinon from 'sinon';
import UpdatePreferenceController from '../../../main/controllers/update_preference/UpdatePreferenceController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { isFieldFilledIn } from '../../../main/components/form/validator';

describe('Update Preference Controller', () => {
  const t = {
    'update-preference': {},
    common: {},
  };
  const userCase = {
    update_preference:
    {
      radio1: '',
      radio2: '',
    },
  };

  const mockFormContent = {
    fields: {
      updatePreference: {
        classes: 'govuk-radios--inline',
        id: 'update-preference',
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
    const controller = new UpdatePreferenceController(mockFormContent);

    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('update-preference');

    controller.get(request, response);
    responseMock.verify();
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'updatePreference', errorType: 'required' }];
    const body = { 'update-preference': '' };

    const controller = new UpdatePreferenceController(mockFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});