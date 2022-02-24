import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class NoticePeriodController {
  private readonly form: Form;

  constructor(private readonly noticePeriodFormContent: FormContent) {
    this.form = new Form(<FormFields>this.noticePeriodFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    console.log(JSON.stringify(req.body));
    setUserCase(req, this.form);
    // TODO: fill in correct navigation
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticePeriodFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NOTICE_PERIOD,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD, {
      ...content,
    });
  };
}
