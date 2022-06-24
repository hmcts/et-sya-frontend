import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { WeeksOrMonths } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

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
        validator: isFieldFilledIn,
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
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NOTICE_LENGTH);
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
