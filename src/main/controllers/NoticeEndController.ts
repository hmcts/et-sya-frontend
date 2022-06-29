import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, NoticeEndDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const notice_dates: DateFormFields = {
  ...NoticeEndDateFormFields,
  id: 'notice-dates',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('noticeEnds', body),
};

export default class NoticeEndController {
  private readonly form: Form;
  private readonly noticeEndContent: FormContent = {
    fields: {
      noticeEnds: notice_dates,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.noticeEndContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const session = req.session;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_TYPE);
    getCaseApi(session.user?.accessToken)
      .updateDraftCase(session.userCase, session.errors)
      .then(() => {
        this.logger.info(`Updated draft case id: ${session.userCase.id}`);
      })
      .catch(error => {
        this.logger.error(error);
      });
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticeEndContent, [TranslationKeys.COMMON, TranslationKeys.NOTICE_END]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_END, {
      ...content,
    });
  };
}
