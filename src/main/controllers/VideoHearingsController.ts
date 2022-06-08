import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class VideoHearingsController {
  private readonly form: Form;
  private readonly videoHearingsContent: FormContent = {
    fields: {
      hearingPreference: {
        id: 'hearingPreference',
        type: 'checkboxes',
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'hearingPreference',
            label: l => l.checkbox1,
            value: 'video',
          },
          {
            name: 'hearingPreference',
            label: l => l.checkbox2,
            value: 'phone',
          },
          {
            divider: true,
          },
          {
            name: 'hearingPreference',
            label: l => l.checkbox3,
            value: 'neither',
            exclusive: true,
            hint: l => l.checkbox3Hint,
            subFields: {
              neitherVideoOrPhoneExplanation: {
                type: 'textarea',
                label: l => l.explain,
                labelSize: 'normal',
              },
            },
          },
        ],
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
    this.form = new Form(<FormFields>this.videoHearingsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    console.log(req.session.userCase);
    handleSessionErrors(req, res, this.form, PageUrls.REASONABLE_ADJUSTMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.videoHearingsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.VIDEO_HEARINGS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.VIDEO_HEARINGS, {
      ...content,
    });
  };
}
