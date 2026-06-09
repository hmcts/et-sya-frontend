import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { DefaultInlineRadioFormFields, saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { updateWorkAddress } from '../helpers/WorkAddressHelper';

const logger = getLogger('ClaimantDidWorkAtController');

export default class ClaimantDidWorkAtController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimantWorkAddressQuestion: {
        ...DefaultInlineRadioFormFields,
        id: 'claimant-work-address',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const isYes = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES);
    if (isYes && req.session.userCase?.respondents?.[0]) {
      updateWorkAddress(req.session.userCase, req.session.userCase.respondents[0]);
    }
    const redirectUrl = isYes ? PageUrls.CLAIMANT_ACAS_CERT_NUM : PageUrls.CLAIMANT_WORK_POSTCODE_ENTER;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondent = req.session.userCase?.respondents?.[0];
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_DID_WORK_AT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_DID_WORK_AT, {
      ...content,
      respondentName: respondent?.respondentName ?? '',
      addressLine1: respondent?.respondentAddress1 ?? '',
      addressLine2: respondent?.respondentAddress2 ?? '',
      addressTown: respondent?.respondentAddressTown ?? '',
      addressCountry: respondent?.respondentAddressCountry ?? '',
      addressPostcode: respondent?.respondentAddressPostcode ?? '',
    });
  };
}
