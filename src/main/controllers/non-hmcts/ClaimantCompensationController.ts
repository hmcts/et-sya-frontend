import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { CurrencyFormFields, DefaultCurrencyFormFields } from '../../definitions/currency-fields';
import { TellUsWhatYouWant, TypesOfClaim } from '../../definitions/definition';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const totalCompensationAmountField: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'total-compensation-amount',
  label: (l: AnyRecord): string => l.amountLabel,
};

const logger = getLogger('ClaimantCompensationController');

export default class ClaimantCompensationController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      compensationDetails: {
        id: 'compensationDetails',
        type: 'textarea',
        label: (l: AnyRecord): string => l.label,
        labelSize: 'l',
        hint: (l: AnyRecord): string => l.hint,
        attributes: { title: 'Compensation details text area' },
      },
      totalCompensationAmount: totalCompensationAmountField,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, this.getRedirectUrl(req));
  };

  private getRedirectUrl(req: AppRequest): string {
    if (req.session.userCase?.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      return PageUrls.CLAIMANT_TRIBUNAL_RECOMMENDATION;
    }
    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      return PageUrls.WHISTLEBLOWING_CLAIMS;
    }
    return PageUrls.CLAIMANT_LINKED_CASES;
  }

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_COMPENSATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_COMPENSATION, { ...content });
  };
}
