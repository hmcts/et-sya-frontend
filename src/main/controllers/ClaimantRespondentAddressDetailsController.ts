import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentAddressContent } from './helpers/RespondentAddressHelper';
import { fillRespondentAddressFields } from './helpers/RespondentHelpers';

const logger = getLogger('ClaimantRespondentAddressDetailsController');

export default class ClaimantRespondentAddressDetailsController {
  private readonly form: Form;
  private readonly formContent: FormContent = getRespondentAddressContent(false);

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.params.respondentNumber = req.session.claimantRespondentNumber ?? '1';
    // If the claimant never worked for the employer, the "did you work at this address" question
    // does not apply, so skip straight to the Acas certificate question.
    const redirectUrl =
      req.session.userCase?.pastEmployer === YesOrNo.NO
        ? PageUrls.CLAIMANT_ACAS_CERT_NUM
        : PageUrls.CLAIMANT_DID_WORK_AT;
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondentName = req.session.userCase?.respondents?.[0]?.respondentName ?? '';
    const content = getPageContent(
      req,
      this.formContent,
      [
        TranslationKeys.COMMON,
        TranslationKeys.RESPONDENT_ADDRESS,
        TranslationKeys.CLAIMANT_RESPONDENT_ADDRESS_DETAILS,
        TranslationKeys.ENTER_ADDRESS,
      ],
      0
    );
    const addressTypes = req.session.userCase.respondentAddressTypes;
    if (addressTypes !== undefined && req.session.userCase.respondentAddresses) {
      fillRespondentAddressFields(addressTypes, req.session.userCase);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_ADDRESS_DETAILS, {
      ...content,
      respondentName,
    });
  };
}
