import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class noticePeriodNolongerworkingController {
  private readonly form: Form;

  constructor(private readonly noticePeriodFormContent: FormContent) {
    this.form = new Form(<FormFields>this.noticePeriodFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_PERIOD_NO_LONGER_WORKING);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticePeriodFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING, {
      ...content,
    });
  };
}
