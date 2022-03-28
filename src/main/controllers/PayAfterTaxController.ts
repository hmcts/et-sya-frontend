import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { PayIntervalRadioValues, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PayAfterTaxController {
  private readonly form: Form;
  private readonly payAfterTaxContent: FormContent = {
    fields: {
      payAfterTax: {
        id: 'pay-after-tax',
        name: 'pay-after-tax',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.payAfterTax,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 12 },
      },
      payAfterTaxInterval: {
        id: 'pay-after-tax-interval',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.label,
        values: PayIntervalRadioValues,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
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
