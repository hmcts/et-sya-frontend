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
            value: 'hearingLoop',
          },
          {
            name: 'communicating',
            label: l => l.checkbox2,
            value: 'InfraredReceiver',
          },
          {
            name: 'communicating',
            label: l => l.checkbox3,
            value: 'closeToSpeaker',
          },
          {
            name: 'communicating',
            label: l => l.checkbox4,
            hint: l => l.checkbox4Hint,
            value: 'lipSpeaker',
          },
          {
            name: 'communicating',
            label: l => l.checkbox5,
            value: 'signLanugage',
          },
          {
            name: 'communicating',
            label: l => l.checkbox6,
            value: 'speechToText',
          },
          {
            name: 'communicating',
            label: l => l.checkbox7,
            value: 'extraTime',
          },
          {
            name: 'communicating',
            label: l => l.checkbox8,
            value: 'visitBefore',
          },
          {
            name: 'communicating',
            label: l => l.checkbox9,
            value: 'explanationOfCourt',
          },
          {
            name: 'communicating',
            label: l => l.checkbox10,
            value: 'Intermediary',
            hint: l => l.checkbox10Hint,
            subFields: {
              communicatingIntermediaryExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'communicating',
            label: l => l.other,
            value: 'other',
            subFields: {
              communicatingOtherExplanation: {
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
            name: 'communicating',
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
    this.form = new Form(<FormFields>this.communicatingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    console.log('begin post function');
    console.log('req.session', req.session);

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.SUPPORT);

    console.log('end post function');
    console.log('req.session', req.session);
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
