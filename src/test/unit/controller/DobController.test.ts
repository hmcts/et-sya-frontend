import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import DobController from '../../../main/controllers/dob/DobController';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { areDateFieldsFilledIn } from '../../../main/components/form/validator';

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
            label: 'Day',
            name: 'day',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
            value: '24',
          },
          {
            label: 'Month',
            name: 'month',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
            value: '12',
          },
          {
            label: 'Year',
            name: 'year',
            classes: 'govuk-input--width-4',
            attributes: { maxLength: 4 },
            value: '2000',
          },
        ],
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
    const errors = [{ propertyName: 'dobDate', errorType: 'required' }];
    const body = { dobDate: 'field is required' };
    const mockDobFormContent = {
      fields: {
        dobDate: {
          type: 'date',
          validator: (value: any) => areDateFieldsFilledIn(value),
        },
      },
    } as unknown as FormContent;

    const controller = new DobController(mockDobFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: '1234',
      dobDate: 'field is required',
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'dobDate', errorType: 'required' }];
    const body = { dobDate: 'field is required' };
    const mockDobFormContent = {
      fields: {
        dobDate: {
          type: 'date',
          validator: (value: any) => areDateFieldsFilledIn(value),
        },
      },
    } as unknown as FormContent;

    const controller = new DobController(mockDobFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: '1234',
      dobDate: 'field is required',
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
