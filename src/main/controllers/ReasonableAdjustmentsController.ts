import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class ReasonableAdjustmentsController {
  private readonly form: Form;
  private readonly reasonableAdjustmentsContent: FormContent = {
    fields: {
      reasonableAdjustments: {
        id: 'reasonableAdjustments',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        labelSize: 'l',
        isPageHeading: true,
        hint: l => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'reasonableAdjustments',
            hint: l => l.documents.hint,
            label: l => l.documents.text,
            value: 'documents',
          },
          {
            name: 'reasonableAdjustments',
            hint: l => l.communicating.hint,
            label: l => l.communicating.text,
            value: 'communicating',
          },
          {
            name: 'reasonableAdjustments',
            hint: l => l.support.hint,
            label: l => l.support.text,
            value: 'support',
          },
          {
            name: 'reasonableAdjustments',
            hint: l => l.comfortable.hint,
            label: l => l.comfortable.text,
            value: 'comfortable',
          },
          {
            name: 'reasonableAdjustments',
            hint: l => l.travelling.hint,
            label: l => l.travelling.text,
            value: 'travelling',
          },
          {
            divider: true,
          },
          {
            name: 'reasonableAdjustments',
            label: l => l.noSupport,
            value: 'noSupport',
            exclusive: true,
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.reasonableAdjustmentsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.DOCUMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.reasonableAdjustmentsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REASONABLE_ADJUSTMENTS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
