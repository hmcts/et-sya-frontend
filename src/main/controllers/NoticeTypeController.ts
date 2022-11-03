import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, returnNextPage } from './helpers/RouterHelpers';

const logger = getLogger('NoticeTypeController');

export default class NoticeTypeController {
  private readonly form: Form;
  private readonly noticeTypeContent: FormContent = {
    fields: {
      noticePeriodUnit: {
        id: 'notice-type',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.labelHidden,
        labelHidden: true,
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
    this.form = new Form(<FormFields>this.noticeTypeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    let redirectUrl;
    if (
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.WEEKS) ||
      conditionalRedirect(req, this.form.getFormFields(), WeeksOrMonths.MONTHS)
    ) {
      redirectUrl = PageUrls.NOTICE_LENGTH;
    } else {
      redirectUrl = PageUrls.AVERAGE_WEEKLY_HOURS;
    }
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    returnNextPage(req, res, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticeTypeContent, [TranslationKeys.COMMON, TranslationKeys.NOTICE_TYPE]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_TYPE, {
      ...content,
      employmentStatus,
    });
  };
}
