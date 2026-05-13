import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';

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
