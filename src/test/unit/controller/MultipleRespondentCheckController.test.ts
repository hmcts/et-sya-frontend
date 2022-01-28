import MultipleRespondentCheckController from '../../../main/controllers/multiple_respondent/MultipleRespondentCheckController';
import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';

describe('Mutiple Response Controller Tests', () => {
  const t = {
    'multiple-respondent-check': {},
    common: {},
  };

  const mockedFormContent = {
    fields: {
      isMultipleRespondent: {
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
            value: YesOrNo.YES,
          },
          {
            name: 'radio_single',
            label: 'I have an account',
            selected: false,
            value: YesOrNo.NO,
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
    const errors = [{ propertyName: 'isMultipleRespondent', errorType: 'required' }];
    const body = { 'isMultipleRespondent': '' };
    const controller = new MultipleRespondentCheckController(mockedFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = { 'isMultipleRespondent': YesOrNo.YES };
    const controller = new MultipleRespondentCheckController(mockedFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
    expect(req.session.errors).toEqual([]);
  });
});
