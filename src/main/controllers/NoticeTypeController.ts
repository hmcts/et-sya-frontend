import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('NoticeTypeController');

export default class NoticeTypeController {
  private readonly form: Form;
  private readonly noticeTypeContent: FormContent = {
    fields: {
      noticePeriodUnit: {
        id: 'notice-type',
        type: 'radios',
        classes: 'govuk-radios--inline',
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          {
            label: (l: AnyRecord): string => l.weeks,
            value: WeeksOrMonths.WEEKS,
          },
          {
            label: (l: AnyRecord): string => l.months,
            value: WeeksOrMonths.MONTHS,
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
    this.form = new Form(<FormFields>this.noticeTypeContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.noticePeriodUnit = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.WEEKS) ||
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.MONTHS)
    ) {
      redirectUrl = PageUrls.NOTICE_LENGTH;
    } else {
      redirectUrl = PageUrls.AVERAGE_WEEKLY_HOURS;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.noticeTypeContent, [TranslationKeys.COMMON, TranslationKeys.NOTICE_TYPE]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    const noticePeriodUnit = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    noticePeriodUnit.label =
      employmentStatus === 'Working' || employmentStatus === 'Notice'
        ? l => l.workingHeader
        : l => l.noLongerWorkingHeader;
    res.render(TranslationKeys.NOTICE_TYPE, {
      ...content,
      employmentStatus,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
