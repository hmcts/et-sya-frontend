import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { claimantRepresented } from '../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

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
            value: claimantRepresented.NO,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: claimantRepresented.YES,
          },
          {
            label: (l: AnyRecord): string => l.radio3,
            value: claimantRepresented.LEGAL_REP_SINGLE_CLAIM,
          },
          {
            label: (l: AnyRecord): string => l.radio4,
            value: claimantRepresented.LEGAL_REP_GROUP_CLAIM,
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
    let redirectUrl;
    if (req.body.claimantRepresentedQuestion === claimantRepresented.NO) {
      redirectUrl = PageUrls.SINGLE_OR_MULTIPLE_CLAIM;
    } else if (
      req.body.claimantRepresentedQuestion === claimantRepresented.YES ||
      req.body.claimantRepresentedQuestion === claimantRepresented.LEGAL_REP_GROUP_CLAIM
    ) {
      redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    } else if (req.body.claimantRepresentedQuestion === claimantRepresented.LEGAL_REP_SINGLE_CLAIM) {
      redirectUrl = PageUrls.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE;
    } else {
      redirectUrl = PageUrls.LIP_OR_REPRESENTATIVE;
    }
    handlePostLogicPreLogin(req, res, this.form, redirectUrl);
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
