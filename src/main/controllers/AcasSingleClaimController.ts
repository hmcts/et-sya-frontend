import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class AcasSingleClaimController {
  private readonly form: Form;
  private readonly acasSingleClaimFormContent: FormContent = {
    fields: {
      isAcasSingle: {
        classes: 'govuk-radios--inline',
        id: 'acas-single',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
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
    this.form = new Form(<FormFields>this.acasSingleClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.TYPE_OF_CLAIM
      : PageUrls.NO_ACAS_NUMBER;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasSingleClaimFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_SINGLE_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_SINGLE_CLAIM, {
      ...content,
    });
  };
}
