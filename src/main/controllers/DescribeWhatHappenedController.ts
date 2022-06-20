import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class DescribeWhatHappenedController {
  private readonly form: Form;
  private readonly describeWhatHappenedFormContent: FormContent = {
    fields: {
      claimSummaryText: {
        id: 'claim-summary-text',
        type: 'charactercount',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.textInputHint,
        maxlength: 2500,
      },
      claimSummaryFile: {
        id: 'claim-summary-file',
        type: 'upload',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.fileUpload.hint,
        isCollapsable: true,
        collapsableTitle: l => l.fileUpload.linkText,
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
    this.form = new Form(<FormFields>this.describeWhatHappenedFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TELL_US_WHAT_YOU_WANT);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.describeWhatHappenedFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.DESCRIBE_WHAT_HAPPENED,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DESCRIBE_WHAT_HAPPENED, {
      ...content,
    });
  };
}
