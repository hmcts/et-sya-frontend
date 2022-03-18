import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class UpdatePreferenceController {
  private readonly form: Form;
  private readonly updatePrefFormContent: FormContent = {
    fields: {
      updatePreference: {
        classes: 'govuk-radios',
        id: 'update-preference',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            name: 'radio1',
            value: YesOrNo.YES,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.no,
            name: 'radio2',
            value: YesOrNo.NO,
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.updatePrefFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.VIDEO_HEARINGS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.updatePrefFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.UPDATE_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.UPDATE_PREFERENCE, {
      ...content,
    });
  };
}
