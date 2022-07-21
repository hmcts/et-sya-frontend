import { Response } from 'express';

import { Form } from '../components/form/form';
import { isInvalidPostcode } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class WorkPostcodeController {
  private readonly form: Form;
  private readonly workPostcodeContent: FormContent = {
    fields: {
      workPostcode: {
        id: 'workPostcode',
        name: 'workPostcode',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isInvalidPostcode,
        label: (l): string => l.postcode,
      },
    },
    submit: {
      text: (l): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.workPostcodeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.LIP_OR_REPRESENTATIVE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.workPostcodeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_POSTCODE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.JOB_TITLE, {
      ...content,
    });
  };
}
