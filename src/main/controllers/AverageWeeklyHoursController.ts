import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidAvgWeeklyHours } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('AverageWeeklyHoursController');

export default class AverageWeeklyHoursController {
  private readonly form: Form;
  private readonly averageWeeklyHoursContent: FormContent = {
    fields: {
      avgWeeklyHrs: {
        id: 'avg-weekly-hrs',
        name: 'avg-weekly-hrs',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.enterAverageHours,
        attributes: { maxLength: 5 },
        validator: isValidAvgWeeklyHours,
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.PAY);
  };

  @CaseStateCheck()
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
