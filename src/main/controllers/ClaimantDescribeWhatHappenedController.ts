import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getClaimSummaryError } from './helpers/ErrorHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';
import { getUploadedFileName } from './helpers/PageContentHelpers';

const logger = getLogger('ClaimantDescribeWhatHappenedController');

export default class ClaimantDescribeWhatHappenedController {
  private uploadedFileName = '';

  private readonly getHint = (label: AnyRecord): string => {
    if (this.uploadedFileName !== '') {
      return (label.fileUpload.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    }
    return label.fileUpload.hint;
  };

  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimSummaryText: {
        id: 'claim-summary-text',
        label: l => l.label,
        labelHidden: false,
        labelSize: 'l',
        type: 'charactercount',
        classes: 'govuk-label',
        hint: l => l.hint,
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
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
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
      req.session.save(() => res.redirect(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED));
      return;
    }

    if (req.file) {
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

    this.uploadedFileName = '';
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_TELL_US_WHAT_YOU_WANT);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    this.uploadedFileName = getUploadedFileName(req.session?.userCase?.claimSummaryFile?.document_filename);
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_DESCRIBE_WHAT_HAPPENED, {
      postAddress: PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED,
    });
  };
}
