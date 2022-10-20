import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isValidUKTelNumber } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

export default class TelNumberController {
  private readonly form: Form;
  private readonly telNumberContent: FormContent = {
    fields: {
      telNumber: {
        id: 'telephone-number',
        name: 'telephone-number',
        type: 'tel',
        classes: 'govuk-input--width-20',
        label: (l: AnyRecord): string => l.telNumber,
        attributes: {
          autocomplete: 'tel',
        },
        validator: isValidUKTelNumber,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.telNumberContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.UPDATE_PREFERENCES);
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.telNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TELEPHONE_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TELEPHONE_NUMBER, {
      ...content,
    });
  };
}
