import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class averageWeeklyHoursController {
  private readonly form: Form;

  constructor(private readonly averageWeeklyHoursContent: FormContent) {
    this.form = new Form(<FormFields>this.averageWeeklyHoursContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.PAY_BEFORE_TAX);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.averageWeeklyHoursContent, [
      TranslationKeys.COMMON,
      TranslationKeys.AVERAGE_WEEKLY_HOURS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.AVERAGE_WEEKLY_HOURS, {
      ...content,
    });
  };
}
