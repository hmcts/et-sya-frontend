import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { isAddressSelected } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { AddressPageType } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/postcode-select.json';
import locales from '../resources/locales/en/translation/postcode-select.json';

import { convertJsonArrayToTitleCase, handlePostLogic, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('PostCodeSelectController');

export default class PostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      addressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'addressTypes',
        validator: isAddressSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };
  constructor() {
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl = '';
    switch (req.session.userCase?.addressPageType) {
      case AddressPageType?.RESPONDENT_ADDRESS: {
        redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
        await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
        break;
      }
      case AddressPageType?.PLACE_OF_WORK: {
        redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
        await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
        break;
      }
      case AddressPageType?.ADDRESS_DETAILS: {
        await handlePostLogic(req, res, this.form, logger, PageUrls.ADDRESS_DETAILS);
        break;
      }
      default: {
        break;
      }
    }
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(await getAddressesForPostcode(req.session.userCase.enterPostcode));
    req.session.userCase.addresses = response;
    req.session.userCase.addressTypes = [];
    if (response.length > 0) {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSeveral : locales.selectDefaultSeveral,
      });
    } else if (response.length === 1) {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSingle : locales.selectDefaultSingle,
      });
    } else {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultNone : locales.selectDefaultNone,
      });
    }
    for (const address of response) {
      req.session.userCase.addressTypes.push({
        value: response.indexOf(address),
        label: address.fullAddress,
      });
    }
    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.POSTCODE_SELECT,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    let link = '#';
    if (req.session.userCase?.addressPageType === AddressPageType.ADDRESS_DETAILS) {
      link = PageUrls.ADDRESS_DETAILS;
    } else if (req.session.userCase?.addressPageType === AddressPageType.PLACE_OF_WORK) {
      link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
    } else if (req.session.userCase?.addressPageType === AddressPageType.RESPONDENT_ADDRESS) {
      link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.POSTCODE_SELECT, {
      ...content,
      link,
    });
  };
}
