import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NoticePayController {
  private readonly form: Form;
  private readonly noticePayContent: FormContent = {
    fields: {
      noticePeriodLength: {
        ...DefaultRadioFormFields,
        id: 'notice-pay',
        classes: 'govuk-radios--inline',
        subFields: {
          noticePeriodUnit: {
            id: 'notice-period-unit',
            type: 'option',
            classes: 'govuk-radios--inline',
            label: (l: AnyRecord): string => l.hint1,
            values: [
              {
                label: (l: AnyRecord): string => l.empty,
                attributes: { maxLength: 2 },
                value: 1,
              },
            ],
          },
          noticePeriodPaid: {
            id: 'notice-period-paid',
            type: 'radios',
            classes: 'govuk-radios--inline',
            name: 'notice-period-paid',
            values: [
              {
                label: (l: AnyRecord): string => l.weeks,
                value: WeeksOrMonths.WEEKS,
                selected: false,
              },
              {
                label: (l: AnyRecord): string => l.months,
                value: WeeksOrMonths.MONTHS,
                selected: false,
              },
            ],
          },

          noticePeriodUnit2: {
            id: 'notice-period-unit',
            type: 'option',
            classes: 'govuk-radios--inline',
            label: (l: AnyRecord): string => l.hint2,
            values: [
              {
                label: (l: AnyRecord): string => l.empty,
                attributes: { maxLength: 2 },
                value: 1,
              },
            ],
          },
          noticePeriodPaid2: {
            id: 'notice-period-paid',
            type: 'radios',
            classes: 'govuk-radios--inline',
            name: 'notice-period-pay',
            values: [
              {
                label: (l: AnyRecord): string => l.weeks,
                value: WeeksOrMonths.WEEKS,
                selected: false,
              },
              {
                label: (l: AnyRecord): string => l.months,
                value: WeeksOrMonths.MONTHS,
                selected: false,
              },
            ],
          },
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.noticePayContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.AVERAGE_WEEKLY_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticePayContent, [TranslationKeys.COMMON, TranslationKeys.NOTICE_PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PAY, {
      ...content,
    });
  };
}
