import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class StartDateController {
  private readonly form: Form;
  private readonly startDateContent: FormContent = {
    fields: {
      endDate: {
        id: 'start-date',
        type: 'date',
        classes: 'govuk-date-input',
        label: (l: AnyRecord): string => l.label,
        labelHidden: true,
        values: [
          {
            label: (l: AnyRecord): string => l.dateFormat.day,
            name: 'startDay',
            classes: 'govuk-input--width-2',
          },
          {
            label: (l: AnyRecord): string => l.dateFormat.month,
            name: 'startMonth',
            classes: 'govuk-input--width-2',
          },
          {
            label: (l: AnyRecord): string => l.dateFormat.year,
            name: 'startYear',
            classes: 'govuk-input--width-4',
          },
        ],
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
