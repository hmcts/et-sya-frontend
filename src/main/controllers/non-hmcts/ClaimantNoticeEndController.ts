import { Response } from 'express';

import { Form } from '../../components/form/form';
import { convertToDateObject } from '../../components/form/parser';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { CaseDate } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { DateFormFields, DateValues, NoticeEndDateFormFields } from '../../definitions/dates';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord, UnknownRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { renderPage } from '../helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantNoticeEndController');

const noticeDates: DateFormFields = {
  ...NoticeEndDateFormFields,
  id: 'notice-dates',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('noticeEnds', body),
};

export default class ClaimantNoticeEndController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: { noticeEnds: noticeDates },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NOTICE_TYPE);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.NOTICE_END);
  };
}
