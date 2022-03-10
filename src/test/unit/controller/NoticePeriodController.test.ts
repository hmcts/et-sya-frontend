import { isFieldFilledIn } from '../../../main/components/form/validator';
import NoticePeriodController from '../../../main/controllers/notice_period/NoticePeriodController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Notice Period Controller', () => {
  const t = {
    'notice-period': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      noticePeriod: {
        classes: 'govuk-radios',
        id: 'notice-period',
        type: 'radios',
        values: [
          {
            name: 'radio1',
            label: 'radio1',
            subFields: {
              noticePeriodUnit: {
                id: 'notice-period-length',
                type: 'radios',
                classes: 'govuk-radios--inline',
                values: [
                  {
                    name: 'innerRadio1',
                    label: 'innerRadio1',
                  },
                  {
                    name: 'innerRadio2',
                    label: 'innerRadio2',
                  },
                ],
                validator: isFieldFilledIn,
              },
              noticePeriodLength: {
                id: 'notice-period-unit',
                type: 'input',
                classes: 'govuk-input--width-2',
                label: 'input',
                labelSize: null,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                spellCheck: false,
                attributes: {
                  autocomplete: 'notice-period-length',
                  maxLength: 2,
                },
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'radio1',
            label: 'radio2',
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the next page', () => {
    const controller = new NoticePeriodController(mockFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD, expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [
      {
        propertyName: 'noticePeriodUnit',
        errorType: 'required',
      },
      {
        propertyName: 'noticePeriodLength',
        errorType: 'required',
      },
    ];
    const body = { noticePeriod: 'Yes', noticePeriodUnit: '', noticePeriodLength: '' };
    const controller = new NoticePeriodController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.errors).toEqual(errors);
    expect(res.redirect).toBeCalledWith(req.path);
  });

  it('should assign userCase from notice period form data', () => {
    const body = { noticePeriod: 'Yes', noticePeriodLength: '2', noticePeriodUnit: 'Weeks' };
    const controller = new NoticePeriodController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
    expect(req.session.userCase).toStrictEqual({
      noticePeriod: 'Yes',
      noticePeriodLength: '2',
      noticePeriodUnit: 'Weeks',
    });
  });
});
