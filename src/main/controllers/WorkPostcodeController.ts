import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { handlePostLogicPreLogin, isPostcodeInScope } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

import { Response } from 'express';

export default class WorkPostcodeController {
  private readonly form: Form;
  private readonly workPostcodeContent: FormContent = {
    fields: {
      workPostcode: {
        id: 'workPostcode',
        name: 'workPostcode',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidUKPostcode,
        label: (l): string => l.postcode,
      },
    },
    submit: {
      text: (l): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.workPostcodeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    let redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    if (isPostcodeInScope(req.body.workPostcode)) {
      redirectUrl = PageUrls.LIP_OR_REPRESENTATIVE;
    }
    handlePostLogicPreLogin(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.workPostcodeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_POSTCODE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.JOB_TITLE, {
      ...content,
    });
  };
}
