import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PresentEmployerController {
  private readonly form: Form;
  private readonly presentEmployerFormContent: FormContent = {
    fields: {
      presentEmployer: {
        ...DefaultRadioFormFields,
        id: 'present-employer',
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.presentEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // TODO: Change to the correct redirect url - Employment Details
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.presentEmployerFormContent, ['common', 'present-employer']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('present-employer', {
      ...content,
    });
  };
}
