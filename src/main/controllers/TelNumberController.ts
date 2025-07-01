import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidUKTelNumber } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('TelNumberController');

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

  constructor() {
    this.form = new Form(<FormFields>this.telNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.UPDATE_PREFERENCES);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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
