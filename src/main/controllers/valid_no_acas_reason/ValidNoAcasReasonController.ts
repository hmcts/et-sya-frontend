import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class ValidNoAcasReasonController {
  private readonly form: Form;

  constructor(private readonly validNoAcasReasonFormContent: FormContent) {
    this.form = new Form(<FormFields>this.validNoAcasReasonFormContent.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    // TODO(Angela): Add correct back link for multiple resp
    const pageBackLink =
      !!req.session && !!req.session.userCase && !!req.session.userCase.acasMultiple
        ? '/do-you-have-an-acas-no-many-resps'
        : '/do-you-have-an-acas-single-resps';
    const content = getPageContent(req, this.validNoAcasReasonFormContent, ['common', 'valid-no-acas-reason']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('valid-no-acas-reason', {
      ...content,
      backLink: pageBackLink,
    });
  };

  public post = (req: AppRequest, res: Response): void => {
    // TODO(Angela): Change to the correct redirect url
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? '/type-of-claim'
      : '/contact-acas';

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };
}
