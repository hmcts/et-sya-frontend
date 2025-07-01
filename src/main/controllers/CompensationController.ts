import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CurrencyFormFields, DefaultCompensationCurrencyFormFields } from '../definitions/currency-fields';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const compensation_amount: CurrencyFormFields = {
  ...DefaultCompensationCurrencyFormFields,
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
      compensationAmount: compensation_amount,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.compensationFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      redirectUrl = PageUrls.TRIBUNAL_RECOMMENDATION;
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      redirectUrl = PageUrls.WHISTLEBLOWING_CLAIMS;
    } else {
      redirectUrl = PageUrls.LINKED_CASES;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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
