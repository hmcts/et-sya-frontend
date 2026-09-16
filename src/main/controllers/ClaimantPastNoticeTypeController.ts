import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';
import { conditionalRedirect } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantPastNoticeTypeController');

export default class ClaimantPastNoticeTypeController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      noticePeriodUnit: {
        id: 'claimant-past-notice-type',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          { label: (l: AnyRecord): string => l.weeks, value: WeeksOrMonths.WEEKS },
          { label: (l: AnyRecord): string => l.months, value: WeeksOrMonths.MONTHS },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const hasSelection =
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.WEEKS) ||
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.MONTHS);
    const redirectUrl = hasSelection ? PageUrls.CLAIMANT_NOTICE_LENGTH : PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_PAST_NOTICE_TYPE);
  };
}
