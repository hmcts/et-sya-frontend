import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NoticeLengthController {
  private readonly form: Form;
  private readonly noticeLengthContent: FormContent = {
    fields: {
      noticePeriodLength: {
        id: 'notice-length',
        name: 'notice-length',
        type: 'text',
        classes: 'govuk-input--width-3',
        hint: (l: AnyRecord): string => l.noticeLengthHint,
        attributes: { maxLength: 2 },
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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.noticeLengthContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        this.logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        this.logger.info(error);
      });
    handleSessionErrors(req, res, this.form, PageUrls.AVERAGE_WEEKLY_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
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
