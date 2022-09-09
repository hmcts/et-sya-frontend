import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { hasValidFileFormat, isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';

import { handleUploadDocument, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class DescribeWhatHappenedController {
  private readonly form: Form;
  private readonly describeWhatHappenedFormContent: FormContent = {
    fields: {
      claimSummaryText: {
        id: 'claim-summary-text',
        label: l => l.textInputHint,
        labelHidden: true,
        type: 'charactercount',
        classes: 'govuk-label',
        hint: l => l.textInputHint,
        maxlength: 2500,
        validator: isContent2500CharsOrLess,
      },
      claimSummaryFileName: {
        id: 'claim-summary-file',
        label: l => l.fileUpload.linkText,
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        hint: l => l.fileUpload.hint,
        isCollapsable: true,
        collapsableTitle: l => l.fileUpload.linkText,
        validator: hasValidFileFormat,
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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.describeWhatHappenedFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TELL_US_WHAT_YOU_WANT);

    const result = await handleUploadDocument(req, req.body.claimSummaryFileName, this.logger);
    if (result) {
      req.session.userCase.claimSummaryFile = fromApiFormatDocument(result.data);
    }
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
