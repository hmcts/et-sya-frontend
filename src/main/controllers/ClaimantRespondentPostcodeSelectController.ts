import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { convertJsonArrayToTitleCase, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentAddressTypes } from './helpers/RespondentPostCodeHelper';

const logger = getLogger('ClaimantRespondentPostcodeSelectController');

export default class ClaimantRespondentPostcodeSelectController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      respondentAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'respondentAddressTypes',
        label: l => l.selectAddress,
        labelSize: 'xl',
        isPageHeading: true,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.params.respondentNumber = req.session.claimantRespondentNumber ?? '1';
    await handlePostLogicForRespondent(req, res, this.form, logger, PageUrls.CLAIMANT_RESPONDENT_ADDRESS_DETAILS, true);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.respondentEnterPostcode)
    );
    req.session.userCase.respondentAddresses = response;
    req.session.userCase.respondentAddressTypes = getRespondentAddressTypes(response, req);
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_SELECT,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_SELECT, {
      ...content,
      link: PageUrls.CLAIMANT_RESPONDENT_ADDRESS_DETAILS,
    });
  };
}
