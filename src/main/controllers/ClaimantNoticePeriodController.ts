import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';
import { conditionalRedirect } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantNoticePeriodController');

export default class ClaimantNoticePeriodController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      noticePeriod: {
        id: 'claimant-notice-period',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          { label: (l: AnyRecord): string => l.yes, value: YesOrNo.YES },
          { label: (l: AnyRecord): string => l.no, value: YesOrNo.NO },
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
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIMANT_PAST_NOTICE_TYPE
      : PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_NOTICE_PERIOD);
  };
}
