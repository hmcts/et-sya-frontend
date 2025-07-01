import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidNoticeLength } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('NoticeLengthController');

export default class NoticeLengthController {
  private readonly form: Form;
  private readonly noticeLengthContent: FormContent = {
    fields: {
      noticePeriodLength: {
        id: 'notice-length',
        name: 'notice-length',
        type: 'text',
        label: (l: AnyRecord): string => l.h1.nonNotice,
        labelHidden: true,
        classes: 'govuk-input--width-3',
        hint: (l: AnyRecord): string => l.noticeLengthHint,
        attributes: { maxLength: 2 },
        validator: isValidNoticeLength,
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
    this.form = new Form(<FormFields>this.noticeLengthContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.AVERAGE_WEEKLY_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const content = getPageContent(req, this.noticeLengthContent, [
      TranslationKeys.COMMON,
      req.session.userCase.noticePeriodUnit === WeeksOrMonths.WEEKS
        ? TranslationKeys.NOTICE_LENGTH_WEEKS
        : TranslationKeys.NOTICE_LENGTH_MONTHS,
    ]);
    const employmentStatus = req.session.userCase.isStillWorking;
    const noticeType = req.session.userCase.noticePeriodUnit;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_LENGTH, {
      employmentStatus,
      noticeType,
      ...content,
    });
  };
}
