import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handleUploadDocument } from './helpers/CaseHelpers';
import { getFileErrorMessage, getPdfUploadError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getFilesRows } from './helpers/HearingDocumentUploadHelper';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('HearingDocumentUploadController');

export default class HearingDocumentUploadController {
  private readonly form: Form;
  private readonly hearingDocumentUploadFormContent: FormContent = {
    fields: {
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: l => l.files.title,
        type: 'insetFields',
        subFields: {
          hearingDocument: {
            id: 'hearingDocument',
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
    this.form = new Form(<FormFields>this.hearingDocumentUploadFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    this.form.getParsedBody(req.body, this.form.getFormFields());

    req.session.errors = [];

    const hearingDocumentError = getPdfUploadError(
      req.file,
      req.fileTooLarge,
      userCase.hearingDocument,
      'hearingDocument'
    );
    const pageUrl = PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':appId', req.params.appId) + getLanguageParam(req.url);

    if (hearingDocumentError) {
      req.session.errors.push(hearingDocumentError);
      return res.redirect(pageUrl);
    }
    if (req.body.upload) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          userCase.hearingDocument = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'hearingDocument', errorType: 'backEndError' });
        return res.redirect(pageUrl);
      }
      return res.redirect(pageUrl);
    }
    if (!userCase.hearingDocument) {
      req.session.errors.push({ propertyName: 'hearingDocument', errorType: 'required' });
      return res.redirect(pageUrl);
    }
    return res.redirect(PageUrls.BUNDLES_DOCS_FOR_HEARING_CYA);
  };

  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.hearingDocumentUploadFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.HEARING_DOCUMENT_UPLOAD,
    ]);

    (this.hearingDocumentUploadFormContent.fields as any).inset.subFields.upload.disabled =
      userCase?.hearingDocument !== undefined;

    (this.hearingDocumentUploadFormContent.fields as any).filesUploaded.rows = getFilesRows(
      userCase,
      req.params.appId,
      {
        ...req.t(TranslationKeys.HEARING_DOCUMENT_UPLOAD, { returnObjects: true }),
      }
    );

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.HEARING_DOCUMENT_UPLOAD, { returnObjects: true }),
    };

    res.render(TranslationKeys.HEARING_DOCUMENT_UPLOAD, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase?.id)),
      errorMessage: getFileErrorMessage(req.session.errors, translations.errors.hearingDocument),
      ...content,
    });
  };
}
