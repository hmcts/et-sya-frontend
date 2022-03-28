import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class AverageWeeklyHoursController {
  private readonly form: Form;
  private readonly averageWeeklyHoursContent: FormContent = {
    fields: {
      avgWeeklyHrs: {
        id: 'avg-weekly-hrs',
        name: 'avg-weekly-hrs',
        type: 'text',
        classes: 'govuk-input--width-3',
        label: (l: AnyRecord): string => l.avgWeeklyHrs,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 3 },
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
    this.form = new Form(<FormFields>this.averageWeeklyHoursContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.PAY_BEFORE_TAX);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.averageWeeklyHoursContent, [
      TranslationKeys.COMMON,
      TranslationKeys.AVERAGE_WEEKLY_HOURS,
    ]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.AVERAGE_WEEKLY_HOURS, {
      ...content,
      employmentStatus,
    });
  };
}
