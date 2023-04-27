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

const logger = getLogger('UploadYourFileController');

export default class UploadYourFileController {
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

    this.form.getParsedBody(req.body, this.form.getFormFields());

    req.session.errors = [];

    const hearingDocumentError = getPdfUploadError(
      req.file,
      req.fileTooLarge,
      userCase.hearingDocument,
      'hearingDocumentError'
    );
    console.log('is there a hearing document error? ', hearingDocumentError);

    const pageUrl = PageUrls.UPLOAD_YOUR_FILE.replace(':appId', req.params.appId) + getLanguageParam(req.url);

    if (hearingDocumentError) {
      req.session.errors.push(hearingDocumentError);
      return res.redirect(pageUrl);
    }
    logger.info('does an upload exist? ', !!req.body.upload);

    if (req.body.upload) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          logger.info('setting hearing document to sessions now');
          userCase.hearingDocument = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'hearingDocumentFile', errorType: 'backEndError' });
        return res.redirect(PageUrls.UPLOAD_YOUR_FILE);
      }
      return res.redirect(pageUrl);
    }
    return res.redirect('/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.uploadYourFileFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.UPLOAD_YOUR_FILE,
    ]);

    logger.info('usercase hearing document - false? - ', !!userCase?.hearingDocument);

    (this.uploadYourFileFormContent.fields as any).inset.subFields.upload.disabled =
      userCase?.hearingDocument !== undefined;

    (this.uploadYourFileFormContent.fields as any).filesUploaded.rows = getFilesRows(userCase, req.params.appId, {
      ...req.t(TranslationKeys.UPLOAD_YOUR_FILE, { returnObjects: true }),
    });

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.UPLOAD_YOUR_FILE, { returnObjects: true }),
    };

    res.render(TranslationKeys.UPLOAD_YOUR_FILE, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase?.id)),
      // this transfile may need updated
      errorMessage: getFileErrorMessage(req.session.errors, translations.errors.hearingDocumentError),
      ...content,
    });
  };
}
