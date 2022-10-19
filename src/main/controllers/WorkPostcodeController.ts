import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { isPostcodeMVPLocation, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

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
    setUserCase(req, this.form);
    let redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    if (isPostcodeMVPLocation(req.body.workPostcode)) {
      redirectUrl = PageUrls.LIP_OR_REPRESENTATIVE;
    }
    redirectUrl = setUrlLanguage(req, redirectUrl);
    handleSessionErrors(req, res, this.form, redirectUrl);
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
