import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, RadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const notice_period: RadioFormFields = {
  ...DefaultRadioFormFields,
  id: 'notice-period',
  classes: 'govuk-radios--inline',
};
export default class noticePeriodNolongerworkingController {
  private readonly form: Form;
  private readonly noticePeriodFormContent: FormContent = {
    fields: {
      noticePeriodLength: {
        id: 'notice-period-length',
        type: 'radios',
        classes: 'govuk-radios--inline',
        values: [
          {
            label: notice_period.values[0].value,
            selected: false,
            subFields: {
              noticePeriodUnit: {
                id: 'notice-period-unit',
                type: 'option',
                classes: 'govuk-radios--inline',
                label: (l: AnyRecord): string => l.hint1,
                values: [
                  {
                    label: (l: AnyRecord): string => l.empty,
                    value: 1,
                  },
                ],
              },
              noticePeriodUnit2: {
                id: 'notice-period-unit2',
                type: 'radios',
                classes: 'govuk-radios--inline',
                values: [
                  {
                    label: (l: AnyRecord): string => l.weeks,
                    value: WeeksOrMonths.WEEKS,
                  },
                  {
                    label: (l: AnyRecord): string => l.months,
                    value: WeeksOrMonths.MONTHS,
                  },
                ],
              },

              noticePeriodPaid: {
                id: 'notice-period-paid',
                type: 'option',
                classes: 'govuk-radios--inline',
                label: (l: AnyRecord): string => l.hint2,
                values: [
                  {
                    label: (l: AnyRecord): string => l.empty,
                    value: 1,
                  },
                ],
              },
              noticePeriodPaid2: {
                id: 'notice-period-paid2',
                type: 'radios',
                classes: 'govuk-radios--inline',
                values: [
                  {
                    label: (l: AnyRecord): string => l.weeks,
                    value: WeeksOrMonths.WEEKS,
                  },
                  {
                    label: (l: AnyRecord): string => l.months,
                    value: WeeksOrMonths.MONTHS,
                  },
                ],
              },
            },
          },
          {
            label: notice_period.values[1].value,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };
  constructor() {
    this.form = new Form(<FormFields>this.noticePeriodFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.AVERAGE_WEEKLY_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticePeriodFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING, {
      ...content,
    });
  };
}
