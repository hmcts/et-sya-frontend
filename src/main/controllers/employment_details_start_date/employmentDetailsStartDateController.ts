import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class employmentDetailsStartDateController {
  private readonly form: Form;

  constructor(private readonly employmentDetailsStartDateContent: FormContent) {
    this.form = new Form(<FormFields>this.employmentDetailsStartDateContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    // TODO: Change to the correct redirect url
    // YES, NO or no response - '/employment-details-notice-benefits' RET-1059
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.employmentDetailsStartDateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYMENT_DETAILS_START_DATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.EMPLOYMENT_DETAILS_START_DATE, {
      ...content,
    });
  };
}
