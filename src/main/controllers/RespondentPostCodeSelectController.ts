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
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';
import { getRespondentAddressTypes, getSelectTitle } from './helpers/RespondentPostCodeHelper';

const logger = getLogger('RespondentPostCodeSelectController');

export default class RespondentPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
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
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl, true);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.respondentEnterPostcode)
    );
    req.session.userCase.respondentAddresses = response;
    req.session.userCase.respondentAddressTypes = getRespondentAddressTypes(response, req);
    const content = getPageContent(req, this.postCodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_POSTCODE_SELECT, {
      ...content,
      link: getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS),
      title: getSelectTitle(req),
    });
  };
}
