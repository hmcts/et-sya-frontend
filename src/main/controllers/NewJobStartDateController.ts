import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, NewJobDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const new_job_start_date: DateFormFields = {
  ...NewJobDateFormFields,
  id: 'new-job-start-date',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('newJobStartDate', body),
};

const logger = getLogger('NewJobStartDateController');

export default class NewJobStartDateController {
  private readonly form: Form;
  private readonly newJobStartDateContent: FormContent = {
    fields: { newJobStartDate: new_job_start_date },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.newJobStartDateContent.fields);
  }
  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.newJobStartDate = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.NEW_JOB_PAY);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    new_job_start_date.values = [
      {
        label: (l: AnyRecord): string => l.dateFormat.day,
        name: 'day',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.month,
        name: 'month',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.year,
        name: 'year',
        classes: 'govuk-input--width-4',
        attributes: { maxLength: 4 },
      },
    ];
    this.newJobStartDateContent.fields = { newJobStartDate: new_job_start_date };
    const content = getPageContent(req, this.newJobStartDateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NEW_JOB_START_DATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB_START_DATE, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
