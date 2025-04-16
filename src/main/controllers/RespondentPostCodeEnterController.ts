import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentIndex, getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentPostCodeEnterController');

export default class RespondentPostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      respondentEnterPostcode: {
        id: 'respondentEnterPostcode',
        type: 'text',
        label: l => l.enterPostcode,
        classes: 'govuk-label govuk-!-width-one-half',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
        validator: isValidUKPostcode,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.postCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_POSTCODE_SELECT);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl, true);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON]);
    const respondentIndex = getRespondentIndex(req);
    const respondents = req.session.userCase.respondents;
    const selectedRespondent = respondents[respondentIndex];
    assignFormData(req.session.userCase, this.form.getFormFields());
    const title = req.url?.includes('lng=cy')
      ? localesCy.respondentPostcodeEnterTitle
      : locales.respondentPostcodeEnterTitle;
    res.render(TranslationKeys.RESPONDENT_POSTCODE_ENTER, {
      ...content,
      respondentName: selectedRespondent.respondentName,
      nonUkAddressLink: getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS_NON_UK),
      title,
    });
  };
}
