import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseType } from '../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

export default class SingleOrMultipleController {
  private readonly form: Form;
  private readonly singleOrMultipleContent: FormContent = {
    fields: {
      caseType: {
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        classes: 'govuk-radios',
        id: 'single-or-multiple-claim',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: CaseType.SINGLE,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: CaseType.MULTIPLE,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.singleOrMultipleContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    const redirectUrlAcasMultiple = setUrlLanguage(req, PageUrls.ACAS_MULTIPLE_CLAIM);
    const redirectUrlSingleOrMultiple = setUrlLanguage(req, PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
    let redirectUrl = '';
    if (req.body.caseType === CaseType.SINGLE) {
      redirectUrl = redirectUrlAcasMultiple;
    } else if (req.body.caseType === CaseType.MULTIPLE) {
      redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    } else {
      redirectUrl = redirectUrlSingleOrMultiple;
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
