import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class payBeforeTaxController {
  private readonly form: Form;

  constructor(private readonly payBeforeTaxContent: FormContent) {
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
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY_BEFORE_TAX, {
      ...content,
    });
  };
}
