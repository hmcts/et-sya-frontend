import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class endDateController {
  private readonly form: Form;

  constructor(private readonly endDateContent: FormContent) {
    this.form = new Form(<FormFields>this.endDateContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_PERIOD);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.endDateContent, [TranslationKeys.COMMON, TranslationKeys.END_DATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.END_DATE, {
      ...content,
    });
  };
}
