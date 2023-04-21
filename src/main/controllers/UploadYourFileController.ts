import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getFileUploadError } from './helpers/ErrorHelpers';
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
        inset: {
          id: 'inset',
          classes: 'govuk-heading-m',
          label: l => l.files.title,
          type: 'insetFields',
          subFields: {
            hearingDocumentFile: {
              id: 'hearingDocumentFile',
              classes: 'govuk-label',
              labelHidden: false,
              labelSize: 'm',
              type: 'upload',
            },
            upload: {
              label: (l: AnyRecord): string => l.files.button,
              classes: 'govuk-button--secondary',
              id: 'upload',
              type: 'button',
              name: 'upload',
              value: 'true',
            },
          },
        },
        filesUploaded: {
          label: l => l.files.uploaded,
          type: 'summaryList',
        },
      },
      submit: {
        text: l => l.continue,
      },
    };

  constructor() {
    this.form = new Form(<FormFields>this.uploadYourFileFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    userCase.respondToApplicationText = req.body.respondToApplicationText;

    req.session.errors = [];

    const supportingMaterialError = getFileUploadError(
      req.file,
      req.fileTooLarge,
      userCase.hearingDocument,
      'hearingDocumentError',
      'hearingDocumentFile'
    );

    const supportingMaterialUrl =
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + getLanguageParam(req.url);

    if (supportingMaterialError) {
      req.session.errors.push(supportingMaterialError);
      return res.redirect(supportingMaterialUrl);
    }

    if (req.body.upload) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          userCase.supportingMaterialFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'supportingMaterialFile', errorType: 'backEndError' });
      }
      return res.redirect(supportingMaterialUrl);
    }
    req.session.errors = [];

    return res.redirect(PageUrls.COPY_TO_OTHER_PARTY);
  };

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
