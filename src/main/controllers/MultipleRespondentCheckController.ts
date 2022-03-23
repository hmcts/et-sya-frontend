import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class MultipleRespondentCheckController {
  private readonly form: Form;
  private readonly multipleRespondentContent: FormContent = {
    fields: {
      isMultipleRespondent: {
        id: 'more_than_one_respondent',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            name: 'radio_multiple',
            label: (l: AnyRecord): string => l.radio1,
            value: YesOrNo.YES,
            selected: false,
          },
          {
            name: 'radio_single',
            label: (l: AnyRecord): string => l.radio2,
            value: YesOrNo.NO,
            selected: false,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.multipleRespondentContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.ACAS_MULTIPLE_CLAIM
      : PageUrls.ACAS_SINGLE_CLAIM;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.multipleRespondentContent, [
      TranslationKeys.COMMON,
      TranslationKeys.MULTIPLE_RESPONDENT_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.MULTIPLE_RESPONDENT_CHECK, {
      ...content,
    });
  };
}
