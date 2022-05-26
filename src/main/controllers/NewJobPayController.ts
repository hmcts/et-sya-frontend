import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { PayIntervalRadioValues, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NewJobPayController {
  private readonly form: Form;
  private readonly newJobPayContent: FormContent = {
    fields: {
      newJobPay: {
        id: 'new-job-pay',
        name: 'new-job-pay',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.payBeforeTax,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 12 },
      },
      payInterval: {
        id: 'new-job-pay-interval',
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
    this.form = new Form(<FormFields>this.newJobPayContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.newJobPayContent, [TranslationKeys.COMMON, TranslationKeys.NEW_JOB_PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB_PAY, {
      ...content,
    });
  };
}
