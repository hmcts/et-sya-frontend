import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidEthosCaseReference } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class CaseNumberController {
  private readonly form: Form;
  private readonly caseNumberContent: FormContent = {
    fields: {
      ethosCaseReference: {
        id: 'ethosCaseReference',
        name: 'ethosCaseReference',
        type: 'text',
        validator: isValidEthosCaseReference,
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 16 },
        classes: 'govuk-!-width-one-half',
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.caseNumberContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handlePostLogicPreLogin(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.caseNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CASE_NUMBER_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CASE_NUMBER_CHECK, {
      ...content,
    });
  };
}
