import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultInlineRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleErrors, returnSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentIndex } from './helpers/RespondentHelpers';
import { conditionalRedirect, isReturnUrlIsCheckAnswers } from './helpers/RouterHelpers';
import { getRedirectUrl, updateWorkAddress } from './helpers/WorkAddressHelper';

const logger = getLogger('WorkAddressController');

export default class WorkAddressController {
  private readonly form: Form;
  private readonly workAddressFormContent: FormContent = {
    fields: {
      claimantWorkAddressQuestion: {
        ...DefaultInlineRadioFormFields,
        id: 'work-address',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.workAddressFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const errors = returnSessionErrors(req, this.form);
    if (errors.length === 0) {
      const isRespondentAndWorkAddressSame = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES);
      const isCya = isReturnUrlIsCheckAnswers(req);
      if (isRespondentAndWorkAddressSame) {
        const respondentIndex = getRespondentIndex(req);
        updateWorkAddress(req.session.userCase, req.session.userCase.respondents[respondentIndex]);
      }

      await handleUpdateDraftCase(req, logger);

      const redirectUrl = getRedirectUrl(req, isRespondentAndWorkAddressSame, isCya);
      return res.redirect(setUrlLanguage(req, redirectUrl));
    } else {
      handleErrors(req, res, errors);
    }
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondentIndex = getRespondentIndex(req);
    const respondent = req.session.userCase.respondents[respondentIndex];
    const addressLine1 = respondent.respondentAddress1 || '';
    const addressLine2 = respondent.respondentAddress2 || '';
    const addressTown = respondent.respondentAddressTown || '';
    const addressCountry = respondent.respondentAddressCountry || '';
    const addressPostcode = respondent.respondentAddressPostcode || '';
    const content = getPageContent(req, this.workAddressFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_ADDRESS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_ADDRESS, {
      ...content,
      addressLine1,
      addressLine2,
      addressTown,
      addressCountry,
      addressPostcode,
    });
  };
}
