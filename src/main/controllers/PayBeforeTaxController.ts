import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PayInterval } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PayBeforeTaxController {
  private readonly form: Form;
  private readonly payBeforeTaxContent: FormContent = {
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
      payBeforeTaxInterval: {
        id: 'pay-before-tax-interval',
        type: 'radios',
        classes: 'govuk-radios',
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
    this.form = new Form(<FormFields>this.payBeforeTaxContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.PAY_AFTER_TAX);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.payBeforeTaxContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PAY_BEFORE_TAX,
    ]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY_BEFORE_TAX, {
      ...content,
      employmentStatus,
    });
  };
}
