import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class SupportController {
  private readonly form: Form;
  private readonly supportContent: FormContent = {
    fields: {
      support: {
        id: 'support',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        hint: l => l.hint,
        labelSize: 'l',
        isPageHeading: true,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'support',
            label: l => l.checkbox1,
            value: 'support1',
          },
          {
            name: 'support',
            label: l => l.checkbox1,
            value: 'support2',
          },
          {
            name: 'support',
            label: l => l.checkbox1,
            value: 'support3',
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.supportContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);

    handleSessionErrors(req, res, this.form, PageUrls.COMFORTABLE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.supportContent, [TranslationKeys.COMMON, TranslationKeys.SUPPORT]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
