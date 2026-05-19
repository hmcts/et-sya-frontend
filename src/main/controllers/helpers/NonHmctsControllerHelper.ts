import { Response } from 'express';

import { isValidUKPostcode } from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { NoAcasNumberReason } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';

import { assignFormData, getPageContent } from './FormHelpers';

export const renderPage = (
  req: AppRequest,
  res: Response,
  form: Form,
  formContent: FormContent,
  translationKey: string,
  additionalContext: Record<string, unknown> = {}
): void => {
  const content = getPageContent(req, formContent, [TranslationKeys.COMMON, translationKey]);
  assignFormData(req.session.userCase, form.getFormFields());
  res.render(translationKey, { ...content, ...additionalContext });
};

export const clearFields = (req: AppRequest, ...fieldNames: string[]): void => {
  if (req.session.userCase) {
    fieldNames.forEach(field => {
      (req.session.userCase as unknown as Record<string, unknown>)[field] = undefined;
    });
  }
};

export const handleClearSelection = (req: AppRequest, clearFn: (req: AppRequest) => void): void => {
  if (req.query?.redirect === 'clearSelection') {
    clearFn(req);
  }
};

export const getPostcodeEnterFormContent = (fieldId: string): FormContent => ({
  fields: {
    [fieldId]: {
      id: fieldId,
      type: 'text',
      label: (l: AnyRecord): string => l.enterPostcode,
      classes: 'govuk-label govuk-!-width-one-half',
      attributes: { maxLength: 14, autocomplete: 'postal-code' },
      validator: isValidUKPostcode,
    },
  },
  submit: submitButton,
  saveForLater: saveForLaterButton,
});

export const getNoAcasFormContent = (): FormContent => ({
  fields: {
    noAcasReason: {
      classes: 'govuk-radios',
      id: 'no-acas-reason',
      type: 'radios',
      label: (l: AnyRecord): string => l.legend,
      labelHidden: false,
      labelSize: 'xl',
      values: [
        { name: 'another', label: (l: AnyRecord): string => l.another, value: NoAcasNumberReason.ANOTHER },
        { name: 'no_power', label: (l: AnyRecord): string => l.no_power, value: NoAcasNumberReason.NO_POWER },
        { name: 'employer', label: (l: AnyRecord): string => l.employer, value: NoAcasNumberReason.EMPLOYER },
        {
          name: 'unfair_dismissal',
          label: (l: AnyRecord): string => l.unfair_dismissal,
          value: NoAcasNumberReason.UNFAIR_DISMISSAL,
          hint: (l: AnyRecord): string => l.dismissalHint,
        },
      ],
      validator: isFieldFilledIn,
    },
  },
  submit: { text: (l: AnyRecord): string => l.submit, classes: 'govuk-!-margin-right-2' },
  saveForLater: { text: (l: AnyRecord): string => l.saveForLater, classes: 'govuk-button--secondary' },
});
