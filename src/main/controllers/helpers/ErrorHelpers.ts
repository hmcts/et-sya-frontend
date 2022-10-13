import { Response } from 'express';

import { isFirstDateBeforeSecond } from '../../components/form/dateValidators';
import { Form } from '../../components/form/form';
import {
  arePayValuesNull,
  hasInvalidFileFormat,
  hasInvalidFileSize,
  hasInvalidName,
  isAcasNumberValid,
  isFieldFilledIn,
  isPayIntervalNull,
} from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, HearingPreference, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { FormError } from '../../definitions/form';

import { handleReturnUrl } from './RouterHelpers';

export const getSessionErrors = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError[] => {
  //call get custom errors and add to session errors
  let sessionErrors = form.getErrors(formData);
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

export const handleSessionErrors = (req: AppRequest, res: Response, form: Form, redirectUrl: string): void => {
  const formData = form.getParsedBody(req.body, form.getFormFields());
  const sessionErrors = getSessionErrors(req, form, formData);

  req.session.errors = sessionErrors;

  const { saveForLater } = req.body;
  const requiredErrExists = sessionErrors.some(err => err.errorType === 'required');

  if (saveForLater && (requiredErrExists || !sessionErrors.length)) {
    req.session.errors = [];
    return res.redirect(PageUrls.CLAIM_SAVED);
  }
  if (sessionErrors.length) {
    req.session.save(err => {
      if (err) {
        throw err;
      }
      return res.redirect(req.url);
    });
  } else {
    const nextPage = handleReturnUrl(req, redirectUrl);
    return res.redirect(nextPage);
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
  fileName: string
): FormError => {
  const textProvided = isFieldFilledIn(formData.claimSummaryText) === undefined;
  const fileProvided = file !== undefined;
  const fileFormatInvalid = hasInvalidFileFormat(file);
  const fileNameInvalid = hasInvalidName(file?.originalname);
  const fileSizeInvalid = hasInvalidFileSize(file);

  if (!textProvided && !fileProvided) {
    if (fileProvided || fileName) {
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
  if (fileSizeInvalid) {
    return { propertyName: 'claimSummaryFileName', errorType: fileSizeInvalid };
  }
};
