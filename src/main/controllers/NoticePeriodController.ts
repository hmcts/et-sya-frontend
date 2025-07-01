import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('NoticePeriodController');

export default class NoticePeriodController {
  private readonly form: Form;
  private readonly noticePeriodFormContent: FormContent = {
    fields: {
      noticePeriod: {
        id: 'notice-period',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'xl',
        labelHidden: false,
        classes: 'govuk-radios--inline',
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
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
    this.form = new Form(<FormFields>this.noticePeriodFormContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.noticePeriod = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.NOTICE_TYPE
      : PageUrls.AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const session = req.session;
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.noticePeriodFormContent, [
      TranslationKeys.COMMON,
      session.userCase?.isStillWorking === StillWorking.NO_LONGER_WORKING
        ? TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING
        : TranslationKeys.NOTICE_PERIOD_WORKING,
    ]);
    const employmentStatus = session.userCase?.isStillWorking;
    assignFormData(session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD, {
      ...content,
      employmentStatus,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
