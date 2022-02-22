import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class ValidNoAcasReasonController {
  private readonly form: Form;

  constructor(private readonly validNoAcasReasonFormContent: FormContent) {
    this.form = new Form(<FormFields>this.validNoAcasReasonFormContent.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.validNoAcasReasonFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NO_ACAS_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NO_ACAS_NUMBER, {
      ...content,
    });
  };

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.TYPE_OF_CLAIM
      : PageUrls.CONTACT_ACAS;

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };
}
