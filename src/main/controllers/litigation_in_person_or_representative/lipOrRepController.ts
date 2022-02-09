import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { FormContent, FormFields } from '../../definitions/form';
import getLegacyUrl from '../../utils/getLegacyUrlFromLng';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class LipOrRepController {
  private readonly form: Form;

  constructor(private readonly lipOrRepContent: FormContent) {
    this.form = new Form(<FormFields>this.lipOrRepContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '/lip-or-representative';
    if (req.body.representingMyself === YesOrNo.YES) {
      redirectUrl = '/single-or-multiple-claim';
    } else if (req.body.representingMyself === YesOrNo.NO) {
      redirectUrl = getLegacyUrl(req.language);
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.lipOrRepContent, ['common', 'lip-or-representative']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('lip-or-representative', {
      ...content,
    });
  };
}
