import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class ValidNoAcasReasonController {
  private readonly form: Form;
  private readonly validNoAcasReasonFormContent: FormContent = {
    fields: {
      validNoAcasReason: {
        classes: 'govuk-radios--inline',
        id: 'valid-no-acas-reason',
        type: 'radios',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            name: 'radio1',
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            name: 'radio2',
            value: YesOrNo.NO,
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
    this.form = new Form(<FormFields>this.validNoAcasReasonFormContent.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.validNoAcasReasonFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.VALID_ACAS_REASON,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.VALID_ACAS_REASON, {
      ...content,
    });
  };

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.TYPE_OF_CLAIM
      : PageUrls.CONTACT_ACAS;

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };
}
