import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class WorkAddressController {
  private readonly form: Form;

  constructor(private readonly workAddressContent: FormContent) {
    this.form = new Form(<FormFields>this.workAddressContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.workAddressContent, ['common', 'work-address']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_ADDRESS, {
      ...content,
    });
  };
}
