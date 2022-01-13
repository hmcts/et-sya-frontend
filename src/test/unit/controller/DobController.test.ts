import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import DobController from '../../../main/controllers/dob/DobController';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { areDateFieldsFilledIn } from '../../../main/components/form/validator';
import { convertToDateObject } from '../../../main/components/form/parser';
import { UnknownRecord } from '../../../main/definitions/util-types';

describe('Dob Controller', () => {
  const t = {
    'date-of-birth': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      dobDate: {
        type: 'date',
        values: [
          {
            label: 'day',
            name: 'day',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
          },
          {
            label: 'month',
            name: 'month',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
          },
          {
            label: 'year',
            name: 'year',
            classes: 'govuk-input--width-4',
            attributes: { maxLength: 4 },
          },
        ],
        parser: (body: UnknownRecord): any =>
          convertToDateObject('dobDate', body),
        validator: (value: any) => areDateFieldsFilledIn(value),
      },
    },
  } as unknown as FormContent;

  it('should render the DobController page', () => {
    const dobController = new DobController(mockFormContent);

    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('date-of-birth');

    dobController.get(request, response);
    responseMock.verify();
    expect(request.session.userCase).toEqual({
      dobDate: {
        day: '24',
        month: '12',
        year: '2000',
      },
      id: '1234',
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'dobDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = { 'dobDate-day': '', 'dobDate-month': '11', 'dobDate-year': '2000' };

    const controller = new DobController(mockFormContent);

    const req = mockRequest( { body } );
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: '1234',
      dobDate: {
        day: '',
        month: '11',
        year: '2000',
      },
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
