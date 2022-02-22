import { mock } from 'sinon';

import { isFieldFilledIn } from '../../../main/components/form/validator';
import PresentEmployerController from '../../../main/controllers/present_employer/PresentEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update present Employer Controller', () => {
  const t = {
    'present-employer': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      updatePreference: {
        classes: 'govuk-radios',
        id: 'present-employer',
        type: 'radios',
        values: [
          {
            name: 'radioYes',
            label: 'radio1',
            value: '',
            attributes: { maxLength: 2 },
          },
          {
            name: 'radioNo',
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
    const controller = new PresentEmployerController(mockFormContent);

    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    const responseMock = mock(response);

    responseMock.expects('render').once().withArgs('present-employer');

    controller.get(request, response);
    responseMock.verify();
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'updatePreference', errorType: 'required' }];
    const body = { 'present-employer': '' };

    const controller = new PresentEmployerController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
