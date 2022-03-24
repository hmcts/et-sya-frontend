import { isFieldFilledIn } from '../../../main/components/form/validator';
import noticePeriodNolongerworkingController from '../../../main/controllers/notice_period_no_longer_working/noticePeriodNolongerworkingController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Notice Period No Longer Working Controller', () => {
  const t = {
    'notice-period-no-longer-working': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      noticePeriodunit: {
        classes: 'govuk-radios',
        id: 'notice-period-unit',
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
                type: 'option',
                classes: 'govuk-input--width-2',
                label: 'option',
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
    const controller = new noticePeriodNolongerworkingController(mockFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING, expect.anything());
  });
});
