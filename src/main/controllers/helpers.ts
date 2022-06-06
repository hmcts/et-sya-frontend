import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { Form } from '../components/form/form';
import { arePayValuesNull, isAfterDateOfBirth, isPayIntervalNull } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
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

export const getPartialPayInfoError = (_req: AppRequest, _form: Form, formData: Partial<CaseWithId>): FormError[] => {
  const payBeforeTax = formData.payBeforeTax;
  const payAfterTax = formData.payAfterTax;
  const payInterval = formData.payInterval;

  if (payBeforeTax || payAfterTax) {
    const errorType = isPayIntervalNull(payInterval);
    if (errorType) {
      return [{ errorType, propertyName: 'payInterval' }];
    } else {
      return;
    }
  }

  if (payInterval) {
    const errorType = arePayValuesNull([payBeforeTax.toString(), payAfterTax.toString()]);
    if (errorType) {
      return [
        { errorType, propertyName: 'payBeforeTax' },
        { errorType, propertyName: 'payAfterTax' },
      ];
    }
  }
};

export const getNewJobPartialPayInfoError = (
  _req: AppRequest,
  _form: Form,
  formData: Partial<CaseWithId>
): FormError[] => {
  const newJobPay = formData.newJobPay;
  const newJobPayInterval = formData.newJobPayInterval;

  if (newJobPay) {
    const errorType = isPayIntervalNull(newJobPayInterval);
    if (errorType) {
      return [{ errorType, propertyName: 'newJobPayInterval' }];
    }
  }

  if (newJobPayInterval) {
    const errorType = arePayValuesNull([newJobPay.toString()]);
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
  const payErrors = getPartialPayInfoError(req, form, formData);
  const newJobPayErrors = getNewJobPartialPayInfoError(req, form, formData);

  if (custErrors) {
    sessionErrors = [...sessionErrors, custErrors];
  }

  if (payErrors) {
    sessionErrors = [...sessionErrors, ...payErrors];
  }

  if (newJobPayErrors) {
    sessionErrors = [...sessionErrors, ...newJobPayErrors];
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
