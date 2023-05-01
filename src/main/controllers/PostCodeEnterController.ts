import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { AddressPageType } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('PostCodeEnterController');

export default class PostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      enterPostcode: {
        id: 'enterPostcode',
        type: 'text',
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
    if (
      req.session.userCase?.addressPageType === AddressPageType.RESPONDENT_ADDRESS ||
      req.session.userCase?.addressPageType === AddressPageType.PLACE_OF_WORK
    ) {
      const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.POSTCODE_SELECT);
      await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
    } else {
      req.session.userCase.addressDetailsPostcode = req.body.enterPostcode;
      await handlePostLogic(req, res, this.form, logger, PageUrls.POSTCODE_SELECT);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    let link = '#';
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON, TranslationKeys.POSTCODE_ENTER]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    if (req.session.userCase?.addressPageType === AddressPageType.ADDRESS_DETAILS) {
      link = PageUrls.ADDRESS_DETAILS;
      req.session.userCase.enterPostcode = req.session.userCase.addressDetailsPostcode;
    } else if (req.session.userCase?.addressPageType === AddressPageType.PLACE_OF_WORK) {
      link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
      req.session.userCase.enterPostcode = req.session.userCase.placeOfWorkPostcode;
    } else if (req.session.userCase?.addressPageType === AddressPageType.RESPONDENT_ADDRESS) {
      link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
      req.session.userCase.enterPostcode = req.session.userCase.respondentPostcode;
    }
    res.render(TranslationKeys.POSTCODE_ENTER, {
      ...content,
      link,
    });
  };
}
