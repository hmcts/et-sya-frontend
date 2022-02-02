import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';
import { YesOrNo } from '../../definitions/case';
import  getLegacyUrl  from '../../utils/getLegacyUrlFromLng';

export default class SingleOrMultipleController {
  private readonly form: Form

  constructor(private readonly singleOrMultipleContent: FormContent) {
    this.form = new Form(<FormFields>this.singleOrMultipleContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '/single-or-multiple-claim';
    if (req.body.isASingleClaim === YesOrNo.YES) {
      // this redirect URL below will need updated to the next page 
      redirectUrl = '/';
    } else if (req.body.isASingleClaim === YesOrNo.NO) {
      redirectUrl = getLegacyUrl(req.language);
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.singleOrMultipleContent, [
      'common',
      'single-or-multiple-claim',
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('single-or-multiple-claim', {
      ...content,
    });
  }
}
