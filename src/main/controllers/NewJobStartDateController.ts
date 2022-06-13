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

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const new_job_start_date: DateFormFields = {
  ...NewJobDateFormFields,
  id: 'new-job-start-date',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('newJobStartDate', body),
};

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

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NEW_JOB_PAY);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.newJobStartDateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NEW_JOB_START_DATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB_START_DATE, {
      ...content,
    });
  };
}
