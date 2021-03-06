import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { Form } from '../components/form/form';
import {
  arePayValuesNull,
  isAfterDateOfBirth,
  isPayIntervalNull,
  isValidNoticeLength,
  isValidTwoDigitInteger,
} from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import {
  CaseDataCacheKey,
  CaseDate,
  CaseType,
  CaseWithId,
  Respondent,
  StillWorking,
  YesOrNo,
} from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { sectionStatus } from '../definitions/definition';
import { FormContent, FormError, FormField, FormFields, FormInput, FormOptions } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

export const getPageContent = (req: AppRequest, formContent: FormContent, translations: string[] = []): AnyRecord => {
  const sessionErrors = req.session?.errors || [];
  const userCase = req.session?.userCase;

  let content = {
    form: formContent,
    sessionErrors,
    userCase,
    PageUrls,
  };
  translations.forEach(t => {
    content = { ...content, ...req.t(t, { returnObjects: true }) };
  });
  return content;
};

export const getCustomStartDateError = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError => {
  const dob = req.session.userCase.dobDate;
  const startDate = formData.startDate;

  if (startDate && dob) {
    const errorType = isAfterDateOfBirth(startDate, dob);
    if (errorType) {
      return { errorType: errorType as string, propertyName: Object.keys(form.getFormFields())[0] };
    }
  } else {
    return;
  }
};

export const getCustomNoticeLengthError = (req: AppRequest, formData: Partial<CaseWithId>): FormError => {
  const employmentStatus = req.session.userCase.isStillWorking;
  const noticeLength = formData.noticePeriodLength;

  if (employmentStatus !== StillWorking.NOTICE && noticeLength === '') {
    const invalid = isValidTwoDigitInteger(noticeLength);
    if (invalid) {
      return { errorType: invalid, propertyName: 'noticePeriodLength' };
    }
  } else {
    const errorType = isValidNoticeLength(noticeLength);
    if (errorType) {
      return { errorType, propertyName: 'noticePeriodLength' };
    }
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

export const getSessionErrors = (req: AppRequest, form: Form, formData: Partial<CaseWithId>): FormError[] => {
  return form.getErrors(formData);
};

export const handleSessionErrors = (req: AppRequest, res: Response, form: Form, redirectUrl: string): void => {
  const formData = form.getParsedBody(req.body, form.getFormFields());
  let sessionErrors = getSessionErrors(req, form, formData);

  //call get custom errors and add to session errors
  const custErrors = getCustomStartDateError(req, form, formData);
  const payErrors = getPartialPayInfoError(formData);
  const newJobPayErrors = getNewJobPartialPayInfoError(formData);
  const noticeErrors = getCustomNoticeLengthError(req, formData);

  if (custErrors) {
    sessionErrors = [...sessionErrors, custErrors];
  }

  if (payErrors) {
    sessionErrors = [...sessionErrors, ...payErrors];
  }

  if (newJobPayErrors) {
    sessionErrors = [...sessionErrors, ...newJobPayErrors];
  }

  if (noticeErrors) {
    sessionErrors = [...sessionErrors, noticeErrors];
  }

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
    res.redirect(redirectUrl);
  }
};

export const setUserCase = (req: AppRequest, form: Form): void => {
  const formData = form.getParsedBody(cloneDeep(req.body), form.getFormFields());
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  Object.assign(req.session.userCase, formData);
};

export const setUserCaseWithRedisData = (req: AppRequest, caseData: string): void => {
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
  req.session.userCase.claimantRepresentedQuestion =
    userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED) === YesOrNo.YES.toString() ? YesOrNo.YES : YesOrNo.NO;
  req.session.userCase.caseType =
    userDataMap.get(CaseDataCacheKey.CASE_TYPE) === CaseType.SINGLE.toString() ? CaseType.SINGLE : CaseType.MULTIPLE;
  req.session.userCase.typeOfClaim = JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM));
};

export const setUserCaseForNewRespondent = (req: AppRequest): void => {
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  let respondent: Respondent;
  if (!req.session.userCase.respondents) {
    req.session.userCase.respondents = [];
    respondent = {
      respondentNumber: 1,
      respondentName: req.body.respondentName,
    };
    req.session.userCase.respondents.push(respondent);
    req.session.userCase.selectedRespondent = respondent.respondentNumber;
  } else {
    req.session.userCase.respondents[req.session.userCase.selectedRespondent - 1].respondentName =
      req.body.respondentName;
  }
};

export const assignFormData = (userCase: CaseWithId | undefined, fields: FormFields): void => {
  if (!userCase) {
    userCase = <CaseWithId>{};
    return;
  }

  Object.entries(fields).forEach(([name, field]: [string, FormOptions]) => {
    const caseName = (userCase as AnyRecord)[name];
    if (caseName) {
      field.values = field.values?.map(v => {
        Object.keys(caseName).forEach(key => {
          if (v.name === key) {
            v.value = caseName[key];
          }
        });
        return v;
      });
      for (const [, value] of Object.entries(fields)) {
        (value as FormOptions)?.values
          ?.filter((option: FormInput) => option.subFields !== undefined)
          .map((fieldWithSubFields: FormInput) => fieldWithSubFields.subFields)
          .forEach((subField: Record<string, FormField>) => assignFormData(caseName, subField));
      }
    }
  });
};

export const conditionalRedirect = (
  req: AppRequest,
  formFields: FormFields,
  condition: boolean | string | string[]
): boolean => {
  const matchingValues = Object.entries(req.body).find(([k]) => Object.keys(formFields).some(ff => ff === k));
  if (Array.isArray(condition) && matchingValues) {
    return matchingValues.some(v => {
      return (condition as string[]).some(c => (Array.isArray(v) ? v.some(e => String(e) === c) : v.includes(c)));
    });
  }
  return matchingValues?.some(v => v === condition);
};

export const getSectionStatus = (
  detailsCheckValue: YesOrNo,
  sessionValue: string | CaseDate | number
): sectionStatus => {
  if (detailsCheckValue === YesOrNo.YES) {
    return sectionStatus.completed;
  } else if (detailsCheckValue === YesOrNo.NO || !!sessionValue) {
    return sectionStatus.inProgress;
  } else {
    return sectionStatus.notStarted;
  }
};
