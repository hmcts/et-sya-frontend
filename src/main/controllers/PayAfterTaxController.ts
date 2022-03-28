import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PayInterval } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PayAfterTaxController {
  private readonly form: Form;
  private readonly payAfterTaxContent: FormContent = {
    fields: {
      payAfterTax: {
        name: 'pay-after-tax',
        id: 'pay-after-tax',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.payAfterTax,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 12 },
      },
      payAfterTaxInterval: {
        type: 'radios',
        classes: 'govuk-radios',
        id: 'pay-after-tax-interval',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.weekly,
            value: PayInterval.WEEKLY,
          },
          {
            label: (l: AnyRecord): string => l.monthly,
            value: PayInterval.MONTHLY,
          },
          {
            label: (l: AnyRecord): string => l.annual,
            value: PayInterval.ANNUAL,
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
    this.form = new Form(<FormFields>this.payAfterTaxContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.PENSION);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.payAfterTaxContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PAY_AFTER_TAX,
    ]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY_AFTER_TAX, {
      ...content,
      employmentStatus,
    });
  };
}
