import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate, StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DefaultDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const start_date: DateFormFields = {
  ...DefaultDateFormFields,
  id: 'start-date',
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

  constructor() {
    this.form = new Form(<FormFields>this.startDateContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    let redirectUrl = '';
    if (req.session.userCase.isStillWorking === StillWorking.WORKING) {
      redirectUrl = PageUrls.NOTICE_PERIOD;
    } else if (req.session.userCase.isStillWorking === StillWorking.NOTICE) {
      redirectUrl = PageUrls.NOTICE_END;
    } else if (req.session.userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = PageUrls.END_DATE;
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.startDateContent, [TranslationKeys.COMMON, TranslationKeys.START_DATE]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.START_DATE, {
      ...content,
      employmentStatus,
    });
  };
}
