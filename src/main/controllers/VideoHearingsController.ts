import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreference } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, handleUpdateDraftCase, setUserCase } from './helpers';

export default class VideoHearingsController {
  private readonly form: Form;
  private readonly videoHearingsContent: FormContent = {
    fields: {
      hearing_preferences: {
        id: 'hearing_preferences',
        type: 'checkboxes',
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'hearing_preferences',
            label: l => l.checkboxVideo,
            value: HearingPreference.VIDEO,
          },
          {
            name: 'hearing_preferences',
            label: l => l.checkboxPhone,
            value: HearingPreference.PHONE,
          },
          {
            divider: true,
          },
          {
            name: 'hearing_preferences',
            label: l => l.checkboxNeither,
            exclusive: true,
            hint: l => l.checkboxNeitherHint,
            value: HearingPreference.NEITHER,
            subFields: {
              hearing_assistance: {
                id: 'hearing_assistance',
                type: 'textarea',
                label: l => l.explain,
                labelSize: 'normal',
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.videoHearingsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.REASONABLE_ADJUSTMENTS);
    handleUpdateDraftCase(req, this.logger);
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
