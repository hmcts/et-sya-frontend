import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';

import { handleUpdateDraftCase, handleUploadDocument, setUserCase } from './helpers/CaseHelpers';
import { getClaimSummaryError, handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getUploadedFileName } from './helpers/PageContentHelpers';

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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.describeWhatHappenedFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.fileTooLarge) {
      req.fileTooLarge = false;
      req.session.errors.push({ propertyName: 'claimSummaryFileName', errorType: 'invalidFileSize' });
      return res.redirect(req.url);
    }
    setUserCase(req, this.form);
    req.session.errors = [];
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const claimSummaryError = getClaimSummaryError(
      formData,
      req.file,
      req.session.userCase?.claimSummaryFile?.document_filename
    );
    if (!claimSummaryError) {
      try {
        const result = await handleUploadDocument(req, req.file, this.logger);
        if (result?.data) {
          req.session.userCase.claimSummaryFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        this.logger.info(error);
      } finally {
        this.uploadedFileName = '';
        handleSessionErrors(req, res, this.form, PageUrls.TELL_US_WHAT_YOU_WANT);
        handleUpdateDraftCase(req, this.logger);
      }
    } else {
      req.session.errors.push(claimSummaryError);
      return res.redirect(req.url);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    //   if (req.session.fileTooLarge) {
    //       req.session.fileTooLarge = false;
    //       req.session.errors.push({ propertyName: 'claimSummaryFileName', errorType: 'invalidFileSize' });
    //       return res.redirect(req.url);
    //   }
    const fileName = getUploadedFileName(req.session?.userCase?.claimSummaryFile?.document_filename);
    this.uploadedFileName = fileName;
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
