import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { FormContent, FormError, FormField, FormFields, FormInput, FormOptions } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { CLAIM_SAVED } from '../definitions/constants';

export const getPageContent = (req: AppRequest, formContent: FormContent, translations: string[] = []): AnyRecord => {
  const sessionErrors = req.session?.errors || [];
  const userCase = req.session?.userCase;

  let content = {
    form: formContent,
    sessionErrors,
    userCase,
  };
  translations.forEach(t => {
    content = { ...content, ...req.t(t, { returnObjects: true }) };
  });
  return content;
};

export const getSessionErrors = (req: AppRequest, form: Form): FormError[] => {
  const formData = form.getParsedBody(req.body, form.getFormFields());
  return form.getErrors(formData);
};

export const handleSessionErrors = (req: AppRequest, res: Response, form: Form, redirectUrl: string): void => {
  const sessionErrors = getSessionErrors(req, form);
  req.session.errors = sessionErrors;
  const { saveForLater } = req.body;
  const requiredErrExists = sessionErrors.some((err) => err.errorType === 'required');

  if (saveForLater && (requiredErrExists || !sessionErrors.length)) {
    req.session.errors = [];
    return res.redirect(CLAIM_SAVED);
  }
  if (sessionErrors.length) {
    req.session.save((err) => {
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

export const conditionalRedirect = (req: AppRequest, formFields: FormFields, condition: boolean | string): boolean => {
  const matchingValues = Object.entries(req.body).find(([k]) => Object.keys(formFields).some(ff => ff === k));
  return matchingValues ? matchingValues.some(v => v === condition) : false;
};
