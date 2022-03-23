import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class ComfortableController {
  private readonly form: Form;
  private readonly comfortableContent: FormContent = {
    fields: {
      comfortable: {
        id: 'comfortable',
        type: 'checkboxes',
        label: l => l.h1,
        labelHidden: false,
        labelSize: 'l',
        isPageHeading: true,
        hint: l => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'comfortable',
            label: l => l.checkbox1,
            value: 'comfortable-one',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox1,
            value: 'comfortable-two',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox1,
            value: 'comfortable-three',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox1,
            value: 'comfortable-four',
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.comfortableContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TRAVEL);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.comfortableContent, [TranslationKeys.COMMON, TranslationKeys.COMFORTABLE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
