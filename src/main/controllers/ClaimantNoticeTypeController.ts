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
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantNoticeTypeController');

export default class ClaimantNoticeTypeController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      noticePeriodUnit: {
        id: 'claimant-notice-type',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          {
            label: (l: AnyRecord): string => l.weeks,
            value: WeeksOrMonths.WEEKS,
          },
          {
            label: (l: AnyRecord): string => l.months,
            value: WeeksOrMonths.MONTHS,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.noticePeriodUnit = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const hasSelection =
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.WEEKS) ||
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.MONTHS);
    const redirectUrl = hasSelection ? PageUrls.CLAIMANT_NOTICE_LENGTH : PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    if (req.query?.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NOTICE_TYPE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_NOTICE_TYPE, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
