import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class SingleOrMultipleController {
  private readonly form: Form;
  private readonly singleOrMultipleContent: FormContent = {
    fields: {
      isASingleClaim: {
        type: 'radios',
        classes: 'govuk-radios',
        id: 'single-or-multiple-claim',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: YesOrNo.NO,
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
    let redirectUrl = '';
    if (req.body.isASingleClaim === YesOrNo.YES) {
      redirectUrl = PageUrls.ACAS_MULTIPLE_CLAIM;
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
