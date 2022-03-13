import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class DocumentsController {
  private readonly form: Form;

  constructor(private readonly documentsContent: FormContent) {
    this.form = new Form(<FormFields>this.documentsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.COMMUNICATING);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.documentsContent, [TranslationKeys.COMMON, TranslationKeys.DOCUMENTS]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
