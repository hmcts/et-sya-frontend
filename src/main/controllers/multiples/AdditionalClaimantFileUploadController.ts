import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { setUrlLanguageFromSessionLanguage } from '../helpers/LanguageHelper';
import { AdditionalClaimantSpreadsheetService } from '../helpers/multiples/AdditionalClaimantFileUploadService';

const logger = getLogger('AdditionalClaimantFileUploadController');

const spreadsheetService = new AdditionalClaimantSpreadsheetService();

export default class AdditionalClaimantFileUploadController {
  private readonly form: Form;
  private readonly spreadsheetUploadContent: FormContent = {
    submit: submitButton,
    saveForLater: saveForLaterButton,
    fields: {
      additionalClaimantSpreadsheetName: {
        id: 'claimant-spreadsheet',
        name: 'additionalClaimantSpreadsheetName',
        type: 'fileUpload',
        chooseFilesButtonText: (l: AnyRecord): string => l.fileUpload.chooseFiles,
        dropInstructionText: (l: AnyRecord): string => l.fileUpload.dropInstruction,
        noFileChosenText: (l: AnyRecord): string => l.fileUpload.noFileChosen,
        label: (l: AnyRecord): string => l.section3.p1,
        classes: 'govuk-file-upload',
      },
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.spreadsheetUploadContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }
    req.session.errors = [];

    // Only allow progression if postValidate has successfully uploaded the spreadsheet.
    // postValidate clears additionalClaimantSpreadsheet on any error, so if it is not
    // set the user has not yet completed a successful validate-and-upload.
    if (!req.session.userCase?.additionalClaimantSpreadsheet) {
      req.session.errors = [{ propertyName: 'additionalClaimantSpreadsheetName', errorType: 'required' }];
      return res.redirect(PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD);
    }

    const redirectUrl = setUrlLanguageFromSessionLanguage(req, PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  /**
   * AJAX endpoint: validates the spreadsheet data and uploads the document.
   * All errors set req.session.errors (translation-key driven) and return
   * { redirect } so the client navigates back and the server-rendered error
   * summary displays messages from the translation files.
   * On success returns { success: true } so the client shows a banner in place.
   */
  public postValidate = async (req: AppRequest, res: Response): Promise<void> => {
    if (this.isBotSubmission(req, res)) {
      return;
    }

    req.session.errors = [];
    const saveAndRedirect = this.buildSaveAndRedirect(req, res);

    const filePreConditions = spreadsheetService.validatePreconditions(req);
    if (filePreConditions) {
      req.session.errors.push(filePreConditions);
      await saveAndRedirect();
      return;
    }

    const format = spreadsheetService.validateFileFormat(req);
    if (format) {
      req.session.errors.push(format);
      await saveAndRedirect();
      return;
    }

    try {
      const sheet = await spreadsheetService.validateSpreadsheet(req);
      if (sheet) {
        req.session.errors.push(sheet);
        await saveAndRedirect();
        return;
      }

      req.session.userCase.additionalClaimantSpreadsheet = await spreadsheetService.uploadDocument(req);
      req.session.additionalClaimantUploadedFileName = req.file?.originalname;

      const mappingError = spreadsheetService.mapClaimants(req);
      if (mappingError) {
        req.session.errors.push(mappingError);
        await saveAndRedirect();
        return;
      }

      req.session.save();

      res.json({
        redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
        success: true,
      });
    } catch (error) {
      logger.error(error);

      req.session.errors.push({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'backEndError',
      });

      await saveAndRedirect();
    }
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.spreadsheetUploadContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
    ]);

    const additionalClaimantInvalidRows = req.session.additionalClaimantInvalidRows;
    const uploadedFileName = req.session.additionalClaimantUploadedFileName;

    req.session.additionalClaimantInvalidRows = undefined;
    req.session.additionalClaimantUploadedFileName = undefined;

    assignFormData(req.session.userCase, this.form.getFormFields());

    const maxRowsFlag = await getFlagValue('groupClaimsFileUploadMaxRows', null);
    const maxDataRowsForUpload = maxRowsFlag !== undefined && maxRowsFlag !== null ? Number(maxRowsFlag) : 50;
    res.render(TranslationKeys.ADDITIONAL_CLAIMANT_FILE_UPLOAD, {
      ...content,
      postAddress: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
      additionalErrorInfo: additionalClaimantInvalidRows || maxDataRowsForUpload,
      uploadedFileName,
    });
  };

  public remove = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.session.userCase) {
      req.session.userCase.additionalClaimantSpreadsheet = undefined;
    }
    req.session.additionalClaimantUploadedFileName = undefined;
    req.session.errors = [];

    await new Promise<void>((resolve, reject) => {
      req.session.save(err => (err ? reject(err) : resolve()));
    });

    res.redirect(PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD);
  };

  private isBotSubmission(req: AppRequest, res: Response): boolean {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return true;
    }
    return false;
  }

  private buildSaveAndRedirect(req: AppRequest, res: Response) {
    return async (): Promise<void> => {
      if (req.session.userCase) {
        req.session.userCase.additionalClaimantSpreadsheet = undefined;
      }

      await new Promise<void>((resolve, reject) => {
        req.session.save(err => (err ? reject(err) : resolve()));
      });

      res.json({ redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD });
    };
  }
}
