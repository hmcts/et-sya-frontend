import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CurrencyFormFields, DefaultCurrencyFormFields } from '../definitions/currency-fields';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const compensationAmountField: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'compensation-amount',
  label: (l: AnyRecord): string => l.amountLabel,
};

const logger = getLogger('CompensationController');

export default class CompensationController {
  private readonly form: Form;
  private readonly compensationFormContent: FormContent = {
    fields: {
      compensationOutcome: {
        id: 'compensationOutcome',
        type: 'textarea',
        label: l => l.legend,
        labelSize: 'l',
        hint: l => l.hint,
        attributes: { title: 'Compensation outcome text area' },
        validator: isContent2500CharsOrLess,
      },
      compensationAmount: compensationAmountField,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.compensationFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = getRedirectUrl(req);
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.compensationFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COMPENSATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.COMPENSATION, {
      ...content,
    });
  };
}

const getRedirectUrl = (req: AppRequest): string => {
  if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
    return PageUrls.TRIBUNAL_RECOMMENDATION;
  } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
    return PageUrls.WHISTLEBLOWING_CLAIMS;
  } else {
    return PageUrls.LINKED_CASES;
  }
};
