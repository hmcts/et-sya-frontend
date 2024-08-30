import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseTypeId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class ClaimJurisdictionSelectionController {
  private readonly form: Form;
  private readonly jurisdictionContent: FormContent = {
    fields: {
      claimJurisdiction: {
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        classes: 'govuk-radios',
        hint: (l: AnyRecord): string => l.hintText,
        id: 'claimJurisdiction',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: CaseTypeId.ENGLAND_WALES,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: CaseTypeId.SCOTLAND,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.jurisdictionContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    let redirectUrl: string;
    if (req.body.claimJurisdiction) {
      redirectUrl = PageUrls.ACAS_MULTIPLE_CLAIM;
    } else {
      redirectUrl = PageUrls.CLAIM_JURISDICTION_SELECTION;
    }
    handlePostLogicPreLogin(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.jurisdictionContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIM_JURISDICTION_SELECTION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIM_JURISDICTION_SELECTION, {
      ...content,
    });
  };
}
