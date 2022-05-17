import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { PayIntervalRadioValues, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PayController {
  private readonly form: Form;
  private readonly payContent: FormContent = {
    fields: {
      payBeforeTax: {
        id: 'pay-before-tax',
        name: 'pay-before-tax',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.payBeforeTax,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 12 },
      },
      payAfterTax: {
        id: 'pay-after-tax',
        name: 'pay-after-tax',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.payAfterTax,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 12 },
      },
      payInterval: {
        id: 'pay-interval',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.weeklyMonthlyAnnual,
        values: PayIntervalRadioValues,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.payContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.PENSION);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.payContent, [TranslationKeys.COMMON, TranslationKeys.PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY, {
      ...content,
    });
  };
}
