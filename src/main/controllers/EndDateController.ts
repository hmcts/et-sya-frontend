import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, EndDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, handleUpdateDraftCase, setUserCase } from './helpers';

const end_date: DateFormFields = {
  ...EndDateFormFields,
  id: 'end-date',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('endDate', body),
};

export default class EndDateController {
  private readonly form: Form;
  private readonly endDateFormContent: FormContent = {
    fields: { endDate: end_date },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.endDateFormContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_PERIOD);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.endDateFormContent, [TranslationKeys.COMMON, TranslationKeys.END_DATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.END_DATE, {
      ...content,
    });
  };
}
