import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getHearingDocumentError } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguageFromSessionLanguage } from './helpers/LanguageHelper';
import { getUploadedFileName } from './helpers/PageContentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('UploadYourFileController');

export default class UploadYourFileController {
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (this.uploadedFileName !== '') {
      return (label.fileUpload.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.fileUpload.hint;
    }
  };

  private readonly form: Form;
  private readonly uploadYourFileFormContent: FormContent = {
    fields: {
      hearingDocumentFileName: {
        id: 'hearing-document-file',
        label: l => l.fileUpload.label,
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        hint: l => this.getHint(l),
        isCollapsable: false,
        collapsableTitle: l => l.fileUpload.linkText,
      },
      claimSummaryAcceptedType: {
        id: 'hearing-document-accepted-type',
        label: l => l.acceptedFormats.label,
        labelHidden: true,
        type: 'readonly',
        classes: 'govuk-label',
        isCollapsable: false,
        collapsableTitle: l => l.acceptedFormats.label,
        hint: l => l.acceptedFormats.p1,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.uploadYourFileFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.fileTooLarge) {
      req.session.errors = [{ propertyName: 'hearingDocumentFileName', errorType: 'invalidFileSize' }];
      return res.redirect(PageUrls.UPLOAD_YOUR_FILE);
    }
    req.session.errors = [];

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const hearingDocumentError = getHearingDocumentError(
      formData,
      req.file,
      req.session.userCase?.hearingDocument?.document_filename
    );

    if (hearingDocumentError) {
      req.session.errors.push(hearingDocumentError);
      return res.redirect(PageUrls.UPLOAD_YOUR_FILE);
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
        req.session.userCase.hearingDocument = fromApiFormatDocument(result.data);
      }
    } catch (error) {
      logger.info(error);
      req.session.errors = [{ propertyName: 'hearingDocumentFileName', errorType: 'backEndError' }];
    }
  }

  public get = (req: AppRequest, res: Response): void => {
    this.uploadedFileName = getUploadedFileName(req.session?.userCase?.hearingDocument?.document_filename);
    const content = getPageContent(req, this.uploadYourFileFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.UPLOAD_YOUR_FILE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.UPLOAD_YOUR_FILE, {
      ...content,
      postAddress: PageUrls.UPLOAD_YOUR_FILE,
      cancelLink: `/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`,
    });
  };
}
