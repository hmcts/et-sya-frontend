import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class CommunicatingController {
  private readonly form: Form;
  private readonly communicatingContent: FormContent = {
    fields: {
      communicating: {
        id: 'communicating',
        type: 'checkboxes',
        label: l => l.h1,
        labelSize: 'l',
        isPageHeading: true,
        hint: l => l.hint,
        labelHidden: false,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'communicating',
            label: l => l.checkbox1,
            value: 'val1',
          },
          {
            name: 'communicating',
            label: l => l.checkbox1,
            value: 'val2',
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.communicatingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.SUPPORT);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.communicatingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COMMUNICATING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
