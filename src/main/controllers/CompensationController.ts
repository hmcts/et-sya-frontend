import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CurrencyFormFields, DefaultCurrencyFormFields } from '../definitions/currency-fields';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const compensation_amount: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'compensation-amount',
  label: (l: AnyRecord): string => l.amountLabel,
};

export default class CompensationController {
  private readonly form: Form;
  private readonly compensationFormContent: FormContent = {
    fields: {
      compensationOutcome: {
        id: 'compensationOutcome',
        type: 'textarea',
        hint: l => l.hint,
      },
      compensationAmount: compensation_amount,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.compensationFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      handleSessionErrors(req, res, this.form, PageUrls.TRIBUNAL_RECOMMENDATION);
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      handleSessionErrors(req, res, this.form, PageUrls.WHISTLEBLOWING_CLAIMS);
    } else {
      handleSessionErrors(req, res, this.form, PageUrls.CLAIM_DETAILS_CHECK);
    }
  };

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
