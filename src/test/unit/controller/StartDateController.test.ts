import { convertToDateObject } from '../../../main/components/form/parser';
import { areDateFieldsFilledIn } from '../../../main/components/form/validator';
import StartDateController from '../../../main/controllers/start_date/StartDateController';
import { CaseDate } from '../../../main/definitions/case';
import { FormContent } from '../../../main/definitions/form';
import { UnknownRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('StartDate Controller', () => {
  const t = {
    'start-date': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      startDate: {
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
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('startDate', body),
        validator: jest.fn(areDateFieldsFilledIn),
      },
    },
  } as unknown as FormContent;

  it('should render the StartDateController page', () => {
    const startDateController = new StartDateController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    startDateController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('start-date', expect.anything());
    expect(request.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
      id: '1234',
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'startDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'startDate-day': '',
      'startDate-month': '11',
      'startDate-year': '2000',
    };

    const controller = new StartDateController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '',
        month: '11',
        year: '2000',
      },
      id: '1234',
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
