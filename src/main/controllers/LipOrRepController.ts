import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

export default class LipOrRepController {
  private readonly form: Form;
  private readonly lipOrRepContent: FormContent = {
    fields: {
      claimantRepresentedQuestion: {
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        classes: 'govuk-radios',
        id: 'lip-or-representative',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: YesOrNo.NO,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: YesOrNo.YES,
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
    this.form = new Form(<FormFields>this.lipOrRepContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl;
    if (req.body.claimantRepresentedQuestion === YesOrNo.NO) {
      redirectUrl = PageUrls.SINGLE_OR_MULTIPLE_CLAIM;
    } else if (req.body.claimantRepresentedQuestion === YesOrNo.YES) {
      redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    } else {
      redirectUrl = PageUrls.LIP_OR_REPRESENTATIVE;
    }
    redirectUrl = setUrlLanguage(req, redirectUrl);
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
