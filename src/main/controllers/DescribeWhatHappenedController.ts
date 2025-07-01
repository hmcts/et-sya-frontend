import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getClaimSummaryError } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguageFromSessionLanguage } from './helpers/LanguageHelper';
import { getUploadedFileName } from './helpers/PageContentHelpers';

const logger = getLogger('DescribeWhatHappenedController');

export default class DescribeWhatHappenedController {
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (this.uploadedFileName !== '') {
      return (label.fileUpload.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.fileUpload.hint;
    }
  };

  private readonly form: Form;
  private readonly describeWhatHappenedFormContent: FormContent = {
    fields: {
      claimSummaryText: {
        id: 'claim-summary-text',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'charactercount',
        classes: 'govuk-label',
        hint: l => l.textInputHint,
        maxlength: 2500,
        validator: isContent2500CharsOrLess,
      },
      claimSummaryFileName: {
        id: 'claim-summary-file',
        label: l => l.fileUpload.label,
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        hint: l => this.getHint(l),
        isCollapsable: true,
        collapsableTitle: l => l.fileUpload.linkText,
      },
      claimSummaryAcceptedType: {
        id: 'claim-summary-file-accepted-type',
        label: l => l.acceptedFormats.label,
        labelHidden: true,
        type: 'readonly',
        classes: 'govuk-label',
        isCollapsable: true,
        collapsableTitle: l => l.acceptedFormats.label,
        hint: l => l.acceptedFormats.p1,
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }
    if (req.fileTooLarge) {
      req.session.errors = [{ propertyName: 'claimSummaryFileName', errorType: 'invalidFileSize' }];
      return res.redirect(PageUrls.DESCRIBE_WHAT_HAPPENED);
    }
    req.session.errors = [];

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const claimSummaryError = getClaimSummaryError(
      formData,
      req.file,
      req.session.userCase?.claimSummaryFile?.document_filename,
      logger
    );

    if (claimSummaryError) {
      req.session.errors.push(claimSummaryError);
      return res.redirect(PageUrls.DESCRIBE_WHAT_HAPPENED);
    }

    if (req.file) {
      await this.uploadFile(req);
    }

    this.uploadedFileName = '';

    const redirectUrl = setUrlLanguageFromSessionLanguage(req, PageUrls.TELL_US_WHAT_YOU_WANT);
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  private async uploadFile(req: AppRequest) {
    try {
      const result = await handleUploadDocument(req, req.file, logger);
      if (result?.data) {
        req.session.userCase.claimSummaryFile = fromApiFormatDocument(result.data);
      }
    } catch (error) {
      logger.info(error);
      req.session.errors = [{ propertyName: 'claimSummaryFileName', errorType: 'backEndError' }];
    }
  }

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    this.uploadedFileName = getUploadedFileName(req.session?.userCase?.claimSummaryFile?.document_filename);
    const content = getPageContent(req, this.describeWhatHappenedFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.DESCRIBE_WHAT_HAPPENED,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DESCRIBE_WHAT_HAPPENED, {
      ...content,
      postAddress: PageUrls.DESCRIBE_WHAT_HAPPENED,
    });
  };
}
