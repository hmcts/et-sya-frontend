import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { NoAcasNumberReason } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCaseForRespondent } from './helpers';

export default class NoAcasNumberController {
  private readonly form: Form;
  private readonly noAcasNumberContent: FormContent = {
    fields: {
      noAcasReason: {
        classes: 'govuk-radios',
        id: 'no-acas-reason',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        values: [
          {
            name: 'another',
            label: NoAcasNumberReason.ANOTHER,
            value: NoAcasNumberReason.ANOTHER,
          },
          {
            name: 'no_power',
            label: NoAcasNumberReason.NO_POWER,
            value: NoAcasNumberReason.NO_POWER,
          },
          {
            name: 'employer',
            label: NoAcasNumberReason.EMPLOYER,
            value: NoAcasNumberReason.EMPLOYER,
          },
          {
            name: 'unfair_dismissal',
            label: NoAcasNumberReason.UNFAIR_DISMISSAL,
            value: NoAcasNumberReason.UNFAIR_DISMISSAL,
            hint: (l: AnyRecord): string => l.dismissalhint,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.noAcasNumberContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCaseForRespondent(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.RESPONDENT_DETAILS_CHECK);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noAcasNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NO_ACAS_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NO_ACAS_NUMBER, {
      ...content,
    });
  };
}
