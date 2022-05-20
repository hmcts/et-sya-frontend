import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NoticePeriodController {
  private readonly form: Form;
  private readonly noticePeriodFormContent: FormContent = {
    fields: {
      noticePeriod: {
        id: 'notice-period',
        type: 'radios',
        classes: 'govuk-radios--inline',
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
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
    this.form = new Form(<FormFields>this.noticePeriodFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.NOTICE_TYPE
      : PageUrls.AVERAGE_WEEKLY_HOURS;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticePeriodFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NOTICE_PERIOD,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_PERIOD, {
      ...content,
    });
  };
}
