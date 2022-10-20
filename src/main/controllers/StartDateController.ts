import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate, StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, StartDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

const start_date: DateFormFields = {
  ...StartDateFormFields,
  id: 'startDate',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('startDate', body),
};

export default class StartDateController {
  private readonly form: Form;
  private readonly startDateContent: FormContent = {
    fields: { startDate: start_date },
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
    this.form = new Form(<FormFields>this.startDateContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrlWorking = setUrlLanguage(req, PageUrls.NOTICE_PERIOD);
    const redirectUrlNotice = setUrlLanguage(req, PageUrls.NOTICE_END);
    const redirectUrlNoLongerWorking = setUrlLanguage(req, PageUrls.END_DATE);
    let redirectUrl = '';
    const stillWorking = req.session.userCase.isStillWorking;
    if (stillWorking === StillWorking.WORKING) {
      redirectUrl = redirectUrlWorking;
    } else if (stillWorking === StillWorking.NOTICE) {
      redirectUrl = redirectUrlNotice;
    } else if (stillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = redirectUrlNoLongerWorking;
    }
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    start_date.values = [
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
    this.startDateContent.fields = { startDate: start_date };
    const content = getPageContent(req, this.startDateContent, [TranslationKeys.COMMON, TranslationKeys.START_DATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.START_DATE, {
      ...content,
    });
  };
}
