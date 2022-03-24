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
            value: 'appropriateLighting',
            subFields: {
              comfortableAppropriateLightingExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'comfortable',
            label: l => l.checkbox2,
            value: 'regularBreaks',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox3,
            value: 'spaceToMove',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox4,
            value: 'privateWaitingRoom',
          },
          {
            name: 'comfortable',
            label: l => l.checkbox5,
            value: 'differentTypeOfChair',
            subFields: {
              comfortableDifferentTypeOfChairExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                hint: l => l.checkbox5TextAreaHint,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'comfortable',
            label: l => l.other,
            value: 'other',
            subFields: {
              comfortableOtherExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
              },
            },
          },
          {
            divider: true,
          },
          {
            name: 'comfortable',
            label: l => l.notNeeded,
            value: 'notNeeded',
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
