import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class TravelController {
  private readonly form: Form;
  private readonly travelContent: FormContent = {
    fields: {
      travel: {
        id: 'travel',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        labelSize: 'l',
        hint: l => l.hint,
        isPageHeading: true,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'travel',
            label: l => l.checkbox1,
            value: 'travel-val-one',
          },
          {
            name: 'travel',
            label: l => l.checkbox1,
            value: 'travel-val-two',
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.travelContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.travelContent, [TranslationKeys.COMMON, TranslationKeys.TRAVEL]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
