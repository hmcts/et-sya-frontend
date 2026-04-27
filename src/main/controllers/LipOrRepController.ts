import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { claimantRepresented } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class LipOrRepController {
  private readonly form: Form;
  private readonly lipOrRepContent: FormContent = {
    fields: {
      claimantRepresentedQuestion: {
        type: 'radios',
        label: (l: AnyRecord): string => l.question.legend,
        labelSize: 'l',
        labelHidden: false,
        hint: (l: AnyRecord): string => l.question.hint,
        classes: 'govuk-radios',
        id: 'lip-or-representative',
        values: [
          {
            label: (l: AnyRecord): string => l.question.radio1,
            hint: (l: AnyRecord): string => l.question.radio1Hint,
            value: claimantRepresented.CLAIMING_FOR_MYSELF,
          },
          {
            label: (l: AnyRecord): string => l.question.radio2,
            value: claimantRepresented.CLAIMING_FOR_SOMEONE_ELSE,
          },
          {
            label: (l: AnyRecord): string => l.question.radio3,
            value: claimantRepresented.LEGAL_REP,
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
    if (
      req.body.claimantRepresentedQuestion === claimantRepresented.CLAIMING_FOR_MYSELF ||
      req.body.claimantRepresentedQuestion === claimantRepresented.CLAIMING_FOR_SOMEONE_ELSE
    ) {
      redirectUrl = PageUrls.CLAIM_JURISDICTION_SELECTION;
    } else {
      redirectUrl = PageUrls.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE;
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
