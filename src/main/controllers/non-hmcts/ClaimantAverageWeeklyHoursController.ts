import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isValidAvgWeeklyHours } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('ClaimantAverageWeeklyHoursController');

export default class ClaimantAverageWeeklyHoursController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      avgWeeklyHrs: {
        id: 'avg-weekly-hrs',
        name: 'avg-weekly-hrs',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.enterAverageHours,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 5 },
        validator: isValidAvgWeeklyHours,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_PAY);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_HOURS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_HOURS, {
      ...content,
    });
  };
}
