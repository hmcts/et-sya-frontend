import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class NoticeLengthController {
  private readonly form: Form;
  private readonly noticeLengthContent: FormContent = {
    fields: {
      noticeLength: {
        id: 'notice-length',
        name: 'notice-length',
        type: 'text',
        classes: 'govuk-input--width-3',
        hint: (l: AnyRecord): string => l.noticeLengthHint,
        attributes: { maxLength: 3 },
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
    this.form = new Form(<FormFields>this.noticeLengthContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.AVERAGE_WEEKLY_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.noticeLengthContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NOTICE_LENGTH,
    ]);
    const employmentStatus = req.session.userCase.isStillWorking;
    const noticeType = req.session.userCase.noticePeriodUnit;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NOTICE_LENGTH, {
      ...content,
      employmentStatus,
      noticeType,
    });
  };
}
