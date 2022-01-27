import MultipleRespondentCheckController from '../../../main/controllers/multiple_respondent/MultipleRespondentCheckController';
import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from 'definitions/appRequest';

describe('Mutiple Response Controller Tests', () => {
  const t = {
    'multiple-respondent-check': {},
    common: {},
  };

  const userCase = {
    more_than_one_respondent:
    {
      radio_multiple: '',
      radio_single: '',
    },
  };

  const mockedFormContent = {
    fields: {
      multipleRespondent: {
        id: 'more_than_one_respondent',
        type: 'radios',
        classes: 'govuk-date-input',
        label: 'select',
        labelHidden: true,
        values: [
          {
            name: 'radio_multiple',
            label: 'I have a return number',
            selected: false,
            value: 'Yes',
          },
          {
            name: 'radio_single',
            label: 'I have an account',
            selected: false,
            value: 'No',
          },
        ],
        validator: isFieldFilledIn,
      },
    },
  } as unknown as FormContent;

  it('should render multiple respondent page', () => {
    const controller = new MultipleRespondentCheckController(mockedFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('multiple-respondent-check');

    controller.get(request, response);

    responseMock.verify();
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'multipleRespondent', errorType: 'required' }];
    const body = { 'multipleRespondent': '' };
    const controller = new MultipleRespondentCheckController(mockedFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();

    controller.post(req, res);
    
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = { 'multipleRespondent': 'Yes' };
    const controller = new MultipleRespondentCheckController(mockedFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
    expect(req.session.errors).toEqual([]);
  });
});
