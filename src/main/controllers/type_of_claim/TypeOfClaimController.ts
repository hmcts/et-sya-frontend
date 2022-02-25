import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { AuthUrls, LegacyUrls, TranslationKeys } from '../../definitions/constants';
import { TypesOfClaim } from '../../definitions/definition';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class TypeOfClaimController {
  private readonly form: Form;

  constructor(private readonly typeOfClaimFormContent: FormContent) {
    this.form = new Form(<FormFields>this.typeOfClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), [TypesOfClaim.BREACH_OF_CONTRACT])
      ? AuthUrls.LOGIN
      : LegacyUrls.ET1_BASE;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.typeOfClaimFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TYPE_OF_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TYPE_OF_CLAIM, {
      ...content,
    });
  };
}
