import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/respondent-postcode-select.json';
import locales from '../resources/locales/en/translation/respondent-postcode-select.json';

import { convertJsonArrayToTitleCase, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentPostCodeSelectController');

export default class RespondentPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      respondentAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'respondentAddressTypes',
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
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.respondentEnterPostcode)
    );
    req.session.userCase.respondentAddresses = response;
    req.session.userCase.respondentAddressTypes = [];
    if (response.length > 0) {
      req.session.userCase.respondentAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSeveral : locales.selectDefaultSeveral,
      });
    } else if (response.length === 1) {
      req.session.userCase.respondentAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSingle : locales.selectDefaultSingle,
      });
    } else {
      req.session.userCase.respondentAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultNone : locales.selectDefaultNone,
      });
    }
    for (const address of response) {
      req.session.userCase.respondentAddressTypes.push({
        value: response.indexOf(address),
        label: address.fullAddress,
      });
    }
    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_POSTCODE_SELECT,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    const link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_POSTCODE_SELECT, {
      ...content,
      link,
    });
  };
}
