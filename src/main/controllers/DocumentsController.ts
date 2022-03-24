import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked, isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class DocumentsController {
  private readonly form: Form;
  private readonly documentsContent: FormContent = {
    fields: {
      documents: {
        id: 'documents',
        type: 'checkboxes',
        validator: atLeastOneFieldIsChecked,
        isPageHeading: true,
        labelHidden: false,
        labelSize: 'l',
        hint: l => l.hint,
        label: l => l.h1,
        values: [
          {
            name: 'documents',
            label: l => l.checkbox1,
            value: 'printed',
            subFields: {
              documentsPrintedExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'documents',
            label: l => l.checkbox2,
            value: 'easyRead',
          },
          {
            name: 'documents',
            label: l => l.checkbox3,
            value: 'braille',
          },
          {
            name: 'documents',
            label: l => l.checkbox4,
            value: 'largePrint',
            subFields: {
              documentsLargePrintExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'documents',
            label: l => l.checkbox5,
            value: 'audioTranslation',
          },
          {
            name: 'documents',
            label: l => l.checkbox6,
            value: 'readOut',
          },
          {
            name: 'documents',
            label: l => l.checkbox7,
            value: 'emailed',
          },
          {
            name: 'documents',
            label: l => l.checkbox8,
            value: 'other',
            subFields: {
              documentsOtherExplanation: {
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
            name: 'documents',
            label: l => l.checkbox9,
            value: 'none',
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
    this.form = new Form(<FormFields>this.documentsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    console.log('begin post function');
    console.log('req.session', req.session);

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.COMMUNICATING);

    console.log('end post function');
    console.log('req.session', req.session);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.documentsContent, [TranslationKeys.COMMON, TranslationKeys.DOCUMENTS]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
