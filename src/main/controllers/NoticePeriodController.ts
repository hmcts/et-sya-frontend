import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn, isValidInteger } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NoticePeriodController {
  private readonly form: Form;
  private readonly noticePeriodFormContent: FormContent = {
    fields: {
      noticePeriod: {
        id: 'notice-period',
        type: 'radios',
        classes: 'govuk-radios',
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            conditionalText: (l: AnyRecord): string => l.insetText,
            subFields: {
              noticePeriodUnit: {
                id: 'notice-period-unit',
                type: 'radios',
                classes: 'govuk-radios--inline',
                label: (l: AnyRecord): string => l.unitLabel,
                labelSize: null,
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
                validator: isFieldFilledIn,
              },
              noticePeriodLength: {
                id: 'notice-period-length',
                type: 'input',
                classes: 'govuk-input--width-2',
                label: (l: AnyRecord): string => l.lengthLabel,
                labelSize: null,
                attributes: {
                  autocomplete: 'notice-period-length',
                  maxLength: 2,
                },
                validator: isValidInteger,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
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
      TranslationKeys.NOTICE_PERIOD,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD, {
      ...content,
    });
  };
}
