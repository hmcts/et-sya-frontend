import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidNoticeLength } from '../components/form/validator';
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

const logger = getLogger('ClaimantNoticeLengthController');

export default class ClaimantNoticeLengthController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      noticePeriodLength: {
        id: 'claimant-notice-length',
        name: 'claimant-notice-length',
        type: 'text',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: true,
        classes: 'govuk-input--width-3',
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 2 },
        validator: isValidNoticeLength,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NOTICE_LENGTH,
    ]);
    const noticeType = req.session.userCase?.noticePeriodUnit;
    const h1 = noticeType === WeeksOrMonths.WEEKS ? (content as AnyRecord).h1Weeks : (content as AnyRecord).h1Months;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_NOTICE_LENGTH, {
      ...content,
      h1,
    });
  };
}
