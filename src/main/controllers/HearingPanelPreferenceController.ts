import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContentCharsOrLessAndNotEmpty } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { HearingPanelPreference } from '../definitions/case';
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
  private readonly formContent: FormContent = {
    fields: {
      hearingPanelPreference: {
        type: 'radios',
        label: (l: AnyRecord): string => l.hearingPanelPreference.question,
        values: [
          {
            label: (l: AnyRecord): string => l.hearingPanelPreference.noPreference,
            value: HearingPanelPreference.NO_PREFERENCE,
          },
          {
            label: (l: AnyRecord): string => l.hearingPanelPreference.judge,
            value: HearingPanelPreference.JUDGE,
            subFields: {
              hearingPanelPreferenceReasonJudge: {
                id: 'hearingPanelPreferenceReasonJudge',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.hearingPanelPreference.judgeReason,
                labelSize: 's',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.hearingPanelPreference.panel,
            value: HearingPanelPreference.PANEL,
            subFields: {
              hearingPanelPreferenceReasonPanel: {
                id: 'hearingPanelPreferenceReasonPanel',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.hearingPanelPreference.panelReason,
                labelSize: 's',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.HEARING_PANEL_PREFERENCE,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.hearingPanelPreference = undefined;
      req.session.userCase.hearingPanelPreferenceReasonJudge = undefined;
      req.session.userCase.hearingPanelPreferenceReasonPanel = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REASONABLE_ADJUSTMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.HEARING_PANEL_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.HEARING_PANEL_PREFERENCE, {
      ...content,
    });
  };
}
