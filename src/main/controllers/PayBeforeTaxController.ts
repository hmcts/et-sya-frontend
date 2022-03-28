import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PayBeforeTaxController {
  private readonly form: Form;
  private readonly payBeforeTaxContent: FormContent = {
    fields: {},
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
