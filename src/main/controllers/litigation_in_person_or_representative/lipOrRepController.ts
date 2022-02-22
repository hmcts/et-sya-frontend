import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../../definitions/constants';
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
    let redirectUrl = '';
    if (req.body.representingMyself === YesOrNo.YES) {
      redirectUrl = PageUrls.SINGLE_OR_MULTIPLE_CLAIM;
    } else if (req.body.representingMyself === YesOrNo.NO) {
      redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    } else {
      redirectUrl = PageUrls.LIP_OR_REPRESENTATIVE;
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.lipOrRepContent, [
      TranslationKeys.COMMON,
      TranslationKeys.LIP_OR_REPRESENTATIVE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.LIP_OR_REPRESENTATIVE, {
      ...content,
    });
  };
}
