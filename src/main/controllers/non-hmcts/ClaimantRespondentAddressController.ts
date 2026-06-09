import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { renderPage } from '../helpers/NonHmctsControllerHelper';

export default class ClaimantRespondentAddressController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {},
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_RESPONDENT_ADDRESS);
  };
}
