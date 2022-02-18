import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import getLegacyUrl from '../../utils/getLegacyUrlFromLng';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class SingleOrMultipleController {
  private readonly form: Form;

  constructor(private readonly singleOrMultipleContent: FormContent) {
    this.form = new Form(<FormFields>this.singleOrMultipleContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '';
    if (req.body.isASingleClaim === YesOrNo.YES) {
      redirectUrl = PageUrls.MULTIPLE_RESPONDENT_CHECK;
    } else if (req.body.isASingleClaim === YesOrNo.NO) {
      redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    } else {
      redirectUrl = PageUrls.SINGLE_OR_MULTIPLE_CLAIM;
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.singleOrMultipleContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SINGLE_OR_MULTIPLE_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SINGLE_OR_MULTIPLE_CLAIM, {
      ...content,
    });
  };
}
