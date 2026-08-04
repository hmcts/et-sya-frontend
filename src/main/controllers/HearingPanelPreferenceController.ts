import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent500CharsOrLess, isFieldFilledIn } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('HearingPanelPreferenceController');

export default class HearingPanelPreferenceController {
  private readonly form: Form;

  private readonly hearingPanelPreferenceContent: FormContent = {
    fields: {
      claimantHearingPanelPreference: {
        classes: 'govuk-radios',
        id: 'claimantHearingPanelPreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        validator: isFieldFilledIn,
        values: [
          {
            name: 'claimantHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioNoPreference,
            value: 'No preference',
          },
          {
            name: 'claimantHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioJudge,
            value: 'Judge',
            subFields: {
              claimantHearingPanelPreferenceWhy: {
                id: 'claimantHearingPanelPreferenceWhy',
                name: 'claimantHearingPanelPreferenceWhy',
                type: 'textarea',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.reasonLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 500 },
                validator: isContent500CharsOrLess,
              },
            },
          },
          {
            name: 'claimantHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioPanel,
            value: 'Panel',
            subFields: {
              claimantHearingPanelPreferenceWhy: {
                id: 'claimantHearingPanelPreferenceWhy-panel',
                name: 'claimantHearingPanelPreferenceWhy',
                type: 'textarea',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.reasonLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 500 },
                validator: isContent500CharsOrLess,
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
    this.form = new Form(<FormFields>this.hearingPanelPreferenceContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (Array.isArray(req.body.claimantHearingPanelPreferenceWhy)) {
      req.body.claimantHearingPanelPreferenceWhy =
        req.body.claimantHearingPanelPreferenceWhy.find((val: string) => val && val.trim().length > 0) || undefined;
    }
    if (req.body.claimantHearingPanelPreference === 'No preference') {
      req.body.claimantHearingPanelPreferenceWhy = undefined;
    }
    await handlePostLogic(req, res, this.form, logger, PageUrls.REASONABLE_ADJUSTMENTS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.hearingPanelPreferenceContent, [
      TranslationKeys.COMMON,
      TranslationKeys.HEARING_PANEL_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.HEARING_PANEL_PREFERENCE, {
      ...content,
    });
  };
}
