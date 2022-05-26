import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateValues } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NewJobStartDateController {
  private readonly form: Form;
  private readonly newJobStartDateContent: FormContent = {
    fields: {
      newJobStartDate: {
        id: 'new-job-start-date',
        type: 'date',
        classes: 'govuk-date-input',
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: true,
        values: DateValues,
      },
    },
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
