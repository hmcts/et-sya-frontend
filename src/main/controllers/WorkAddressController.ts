import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultInlineRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleErrors, returnSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentIndex, getRespondentRedirectUrl, updateWorkAddress } from './helpers/RespondentHelpers';
import { conditionalRedirect, returnNextPage } from './helpers/RouterHelpers';

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

  public post = (req: AppRequest, res: Response): void => {
    const { saveForLater } = req.body;
    setUserCase(req, this.form);
    const errors = returnSessionErrors(req, this.form);
    if (errors.length === 0) {
      handleUpdateDraftCase(req, logger);
      const isRespondentAndWorkAddressSame = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES);
      let redirectUrl = isRespondentAndWorkAddressSame
        ? getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.ACAS_CERT_NUM)
        : getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.WORK_POSTCODE_ENTER);
      if (isRespondentAndWorkAddressSame) {
        const respondentIndex = getRespondentIndex(req);
        updateWorkAddress(req.session.userCase, req.session.userCase.respondents[respondentIndex]);
      }
      if (saveForLater) {
        redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_SAVED);
        return res.redirect(redirectUrl);
      } else {
        redirectUrl = setUrlLanguage(req, redirectUrl);
        returnNextPage(req, res, redirectUrl);
      }
    } else {
      handleErrors(req, res, errors);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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
