import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreference } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('VideoHearingsController');

export default class VideoHearingsController {
  private readonly form: Form;
  private readonly videoHearingsContent: FormContent = {
    fields: {
      hearingPreferences: {
        id: 'hearingPreferences',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        values: [
          {
            name: 'hearingPreferences',
            label: l => l.checkboxVideo,
            value: HearingPreference.VIDEO,
          },
          {
            name: 'hearingPreferences',
            label: l => l.checkboxPhone,
            value: HearingPreference.PHONE,
          },
          {
            divider: true,
          },
          {
            name: 'hearingPreferences',
            label: l => l.checkboxNeither,
            exclusive: true,
            hint: l => l.checkboxNeitherHint,
            value: HearingPreference.NEITHER,
            subFields: {
              hearingAssistance: {
                id: 'hearing_assistance',
                type: 'textarea',
                label: l => l.explain,
                labelSize: 'normal',
                attributes: {
                  maxLength: 2500,
                },
                validator: isContent2500CharsOrLess,
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.videoHearingsContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REASONABLE_ADJUSTMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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
