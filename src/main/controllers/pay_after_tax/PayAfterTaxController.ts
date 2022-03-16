import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class payAfterTaxController {
  private readonly form: Form;

  constructor(private readonly payAfterTaxContent: FormContent) {
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
