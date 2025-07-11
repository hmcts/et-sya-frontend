import { Response } from 'express';

import { isFirstDateBeforeSecond } from '../../components/form/date-validator';
import { Form } from '../../components/form/form';
import {
  arePayValuesNull,
  hasInvalidFileFormat,
  hasInvalidName,
  isAcasNumberValid,
  isContent100CharsOrLess,
  isContent2500CharsOrLess,
  isFieldFilledIn,
  isNotPdfFileType,
  isPayIntervalNull,
} from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { AgreedDocuments, CaseWithId, Document, HearingPreference, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { Logger } from '../../logger';

export const returnSessionErrors = (req: AppRequest, form: Form): FormError[] => {
  const formData = form.getParsedBody(req.body, form.getFormFields());
  return getSessionErrors(req, form, formData);
};

const getSessionErrors = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError[] => {
  let sessionErrors = form.getValidatorErrors(formData);
  const custErrors = getCustomStartDateError(req, form, formData);
  const payErrors = getPartialPayInfoError(formData);
  const newJobPayErrors = getNewJobPartialPayInfoError(formData);
  const hearingPreferenceErrors = getHearingPreferenceReasonError(formData);
  const acasCertificateNumberError = getACASCertificateNumberError(formData);
  const otherClaimTypeError = getOtherClaimDescriptionError(formData);

  if (custErrors) {
    sessionErrors = [...sessionErrors, custErrors];
  }

  if (payErrors) {
    sessionErrors = [...sessionErrors, ...payErrors];
  }

  if (newJobPayErrors) {
    sessionErrors = [...sessionErrors, ...newJobPayErrors];
  }

  if (hearingPreferenceErrors) {
    sessionErrors = [...sessionErrors, hearingPreferenceErrors];
  }

  if (acasCertificateNumberError) {
    sessionErrors = [...sessionErrors, acasCertificateNumberError];
  }

  if (otherClaimTypeError) {
    sessionErrors = [...sessionErrors, otherClaimTypeError];
  }

  return sessionErrors;
};

export const getHearingPreferenceReasonError = (formData: Partial<CaseWithId>): FormError => {
  const hearingPreferenceCheckbox = formData.hearingPreferences;
  const hearingPreferenceNeitherTextarea = formData.hearingAssistance;

  if (
    (hearingPreferenceCheckbox as string[])?.includes(HearingPreference.NEITHER) &&
    (!hearingPreferenceNeitherTextarea || hearingPreferenceNeitherTextarea.trim().length === 0)
  ) {
    const errorType = isFieldFilledIn(hearingPreferenceNeitherTextarea);
    if (errorType) {
      return { errorType, propertyName: 'hearingAssistance' };
    }
  }
};

export const getCopyToOtherPartyError = (formData: Partial<CaseWithId>): FormError => {
  const shouldCopy = formData.copyToOtherPartyYesOrNo;
  const radiosErrorType = isFieldFilledIn(shouldCopy);
  if (radiosErrorType) {
    return { errorType: radiosErrorType, propertyName: 'copyToOtherPartyYesOrNo' };
  }

  if (shouldCopy === YesOrNo.NO) {
    const copyText = formData.copyToOtherPartyText;
    const textErrorType = isFieldFilledIn(copyText) || isContent2500CharsOrLess(copyText);
    if (textErrorType) {
      return { errorType: textErrorType, propertyName: 'copyToOtherPartyText' };
    }
  }
};

export const getOtherClaimDescriptionError = (formData: Partial<CaseWithId>): FormError => {
  const claimTypesCheckbox = formData.typeOfClaim;
  const otherClaimTextarea = formData.otherClaim;

  if (
    (claimTypesCheckbox as string[])?.includes('otherTypesOfClaims') &&
    (!otherClaimTextarea || otherClaimTextarea.trim().length === 0)
  ) {
    const errorType = isFieldFilledIn(otherClaimTextarea);
    if (errorType) {
      return { errorType, propertyName: 'otherClaim' };
    }
  } else {
    const x = isContent100CharsOrLess(otherClaimTextarea);
    if (x) {
      return { errorType: x, propertyName: 'otherClaim' };
    }
  }
};

export const getACASCertificateNumberError = (formData: Partial<CaseWithId>): FormError => {
  const certificateRadioButtonSelectedValue = formData.acasCert;
  const acasCertNum = formData.acasCertNum;

  if ((certificateRadioButtonSelectedValue as string)?.includes(YesOrNo.YES)) {
    let errorType = isFieldFilledIn(acasCertNum);
    if (errorType) {
      return { errorType, propertyName: 'acasCertNum' };
    } else {
      errorType = isAcasNumberValid(acasCertNum);
      if (errorType) {
        return { errorType, propertyName: 'acasCertNum' };
      }
    }
  }
};

export const handleErrors = (req: AppRequest, res: Response, sessionErrors: FormError[]): void => {
  req.session.errors = sessionErrors;
  const { saveForLater } = req.body;
  const requiredErrExists = sessionErrors.some(err => err.errorType === 'required');

  if (saveForLater && (requiredErrExists || !sessionErrors.length)) {
    req.session.errors = [];
    return res.redirect(PageUrls.CLAIM_SAVED);
  } else {
    if (sessionErrors.length) {
      req.session.save(err => {
        if (err) {
          throw err;
        }
        return res.redirect(req.url);
      });
    }
  }
};

export const getCustomStartDateError = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError => {
  const dob = req.session.userCase.dobDate;
  const startDate = formData.startDate;

  if (startDate && dob && isFirstDateBeforeSecond(startDate, dob)) {
    return { errorType: 'invalidDateBeforeDOB', propertyName: Object.keys(form.getFormFields())[0] };
  }
};

export const getPartialPayInfoError = (formData: Partial<CaseWithId>): FormError[] => {
  const payBeforeTax = formData.payBeforeTax;
  const payAfterTax = formData.payAfterTax;
  const payInterval = formData.payInterval;

  const required = isPayIntervalNull(payInterval);
  if (required) {
    return payIntervalError(payBeforeTax, payAfterTax);
  }

  if (payInterval) {
    const errorType = arePayValuesNull([`${payBeforeTax || ''}`, `${payAfterTax || ''}`]);
    if (errorType) {
      return [
        { errorType, propertyName: 'payBeforeTax' },
        { errorType, propertyName: 'payAfterTax' },
      ];
    }
  }
};

export const payIntervalError = (payBeforeTax: number, payAfterTax: number): FormError[] => {
  if (payBeforeTax && !payAfterTax) {
    return [{ errorType: 'payBeforeTax', propertyName: 'payInterval' }];
  }

  if (payAfterTax && !payBeforeTax) {
    return [{ errorType: 'payAfterTax', propertyName: 'payInterval' }];
  }

  if (payBeforeTax || payAfterTax) {
    return [{ errorType: 'required', propertyName: 'payInterval' }];
  }
};

export const getNewJobPartialPayInfoError = (formData: Partial<CaseWithId>): FormError[] => {
  const newJobPay = formData.newJobPay;
  const newJobPayInterval = formData.newJobPayInterval;

  if (newJobPay) {
    const errorType = isPayIntervalNull(newJobPayInterval);
    if (errorType) {
      return [{ errorType, propertyName: 'newJobPayInterval' }];
    }
  }

  if (newJobPayInterval) {
    const errorType = arePayValuesNull([`${newJobPay || ''}`]);
    if (errorType) {
      return [{ errorType, propertyName: 'newJobPay' }];
    }
  }
};

export const getClaimSummaryError = (
  formData: Partial<CaseWithId>,
  file: Express.Multer.File,
  fileName: string,
  logger: Logger
): FormError => {
  const textProvided = isFieldFilledIn(formData.claimSummaryText) === undefined;
  const fileProvided = file !== undefined;
  const fileFormatInvalid = hasInvalidFileFormat(file, logger);
  const fileNameInvalid = hasInvalidName(file?.originalname);

  if (!textProvided && !fileProvided) {
    if (fileName) {
      return;
    } else {
      return { propertyName: 'claimSummaryText', errorType: 'required' };
    }
  }

  if (fileFormatInvalid) {
    return { propertyName: 'claimSummaryFileName', errorType: fileFormatInvalid };
  }
  if (fileNameInvalid) {
    return { propertyName: 'claimSummaryFileName', errorType: fileNameInvalid };
  }
};

export const getFileUploadAndTextAreaError = (
  formDataText: string,
  file: Express.Multer.File,
  fileTooLarge: boolean,
  uploadedFile: Document,
  textAreaProperty: string,
  uplodedFileProperty: string,
  logger: Logger
): FormError => {
  const tooLong = isContent2500CharsOrLess(formDataText);
  if (tooLong) {
    return { propertyName: textAreaProperty, errorType: tooLong };
  }

  const textProvided = isFieldFilledIn(formDataText) === undefined;
  const fileProvided = file !== undefined;

  if (!textProvided && !fileProvided && !uploadedFile) {
    return { propertyName: textAreaProperty, errorType: 'required' };
  }

  if (fileTooLarge) {
    return { propertyName: uplodedFileProperty, errorType: 'invalidFileSize' };
  }

  const fileFormatInvalid = hasInvalidFileFormat(file, logger);
  if (fileFormatInvalid) {
    return { propertyName: uplodedFileProperty, errorType: fileFormatInvalid };
  }

  const fileNameInvalid = hasInvalidName(file?.originalname);
  if (fileNameInvalid) {
    return { propertyName: uplodedFileProperty, errorType: fileNameInvalid };
  }
};

export const getPdfUploadError = (
  file: Express.Multer.File,
  fileTooLarge: boolean,
  uploadedFile: Document,
  propertyName: string
): FormError => {
  const fileProvided = file !== undefined;

  if (!fileProvided && !uploadedFile) {
    return { propertyName, errorType: 'required' };
  }

  if (fileTooLarge) {
    return { propertyName, errorType: 'invalidFileSize' };
  }

  const fileFormatInvalid = isNotPdfFileType(file);
  if (fileFormatInvalid) {
    return { propertyName, errorType: fileFormatInvalid };
  }

  const fileNameInvalid = hasInvalidName(file?.originalname);
  if (fileNameInvalid) {
    return { propertyName, errorType: fileNameInvalid };
  }
};

export const getResponseErrors = (formData: Partial<CaseWithId>): FormError => {
  const text = formData.responseText;
  const radio = formData.hasSupportingMaterial;
  const textProvided = isFieldFilledIn(text) === undefined;
  const supportingMaterialAnswer = isFieldFilledIn(radio) === undefined;

  if (!textProvided) {
    if (!supportingMaterialAnswer) {
      return { propertyName: 'responseText', errorType: 'required' };
    }

    if (radio === YesOrNo.NO) {
      return { propertyName: 'responseText', errorType: 'requiredFile' };
    }
  } else {
    const tooLong = isContent2500CharsOrLess(text);
    if (tooLong) {
      return { propertyName: 'responseText', errorType: 'tooLong' };
    }

    if (!supportingMaterialAnswer) {
      return { propertyName: 'hasSupportingMaterial', errorType: 'required' };
    }
  }
};

export const getFileErrorMessage = (errors: FormError[], errorTranslations: AnyRecord): string | undefined => {
  const fileError: FormError = getLastFileError(errors);

  let errorMessage: string;
  if (fileError) {
    errorMessage = errorTranslations[fileError.errorType];
  } else {
    errorMessage = undefined;
  }
  return errorMessage;
};

export const getLastFileError = (errors: FormError[]): FormError => {
  if (errors?.length > 0) {
    for (let i = errors.length - 1; i >= 0; i--) {
      if (['contactApplicationFile', 'supportingMaterialFile', 'hearingDocument'].includes(errors[i].propertyName)) {
        return errors[i];
      }
    }
  }
};

export const aboutHearingDocumentsErrors = (req: AppRequest): FormError[] => {
  const errors: FormError[] = [];
  if (!req.body.whoseHearingDocumentsAreYouUploading) {
    errors.push({ propertyName: 'whoseHearingDocumentsAreYouUploading', errorType: 'required' });
  }
  if (!req.body.whatAreTheseDocuments) {
    errors.push({ propertyName: 'whatAreTheseDocuments', errorType: 'required' });
  }
  return errors;
};

export const agreeingDocumentsForHearingErrors = (req: AppRequest): FormError[] => {
  const errors: FormError[] = [];
  const {
    bundlesRespondentAgreedDocWith: radioButtons,
    bundlesRespondentAgreedDocWithBut: agreedButText,
    bundlesRespondentAgreedDocWithNo: notAgreedText,
  } = req.body;

  if (!radioButtons) {
    errors.push({ propertyName: 'bundlesRespondentAgreedDocWith', errorType: 'required' });
  } else {
    const checkTextLength = (text: string, propertyName: string) => {
      if (!text) {
        errors.push({ propertyName, errorType: 'required' });
      } else if (text.length > 2500) {
        errors.push({ propertyName, errorType: 'exceeded' });
      }
    };

    if (radioButtons === AgreedDocuments.AGREEDBUT) {
      checkTextLength(agreedButText, 'bundlesRespondentAgreedDocWithBut');
    }

    if (radioButtons === AgreedDocuments.NOTAGREED) {
      checkTextLength(notAgreedText, 'bundlesRespondentAgreedDocWithNo');
    }
  }

  return errors;
};
