import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class EndDateController {
  private readonly form: Form;
  private readonly endDateFormContent: FormContent = {
    fields: {
      endDate: {
        id: 'end-date',
        type: 'date',
        classes: 'govuk-date-input',
        label: (l: AnyRecord): string => l.label,
        labelHidden: true,
        hint: (l: AnyRecord): string => l.hint,
        values: [
          {
            label: (l: AnyRecord): string => l.dateFormat.day,
            name: 'day',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.dateFormat.month,
            name: 'month',
            classes: 'govuk-input--width-2',
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.dateFormat.year,
            name: 'year',
            classes: 'govuk-input--width-4',
            attributes: { maxLength: 4 },
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
    this.form = new Form(<FormFields>this.endDateFormContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_PERIOD);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.endDateFormContent, [TranslationKeys.COMMON, TranslationKeys.END_DATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.END_DATE, {
      ...content,
    });
  };
}
