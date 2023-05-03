import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';

import { convertJsonArrayToTitleCase, handlePostLogic } from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('AddressPostCodeSelectController');
export default class AddressPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      addressAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'addressAddressTypes',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };
  constructor() {
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.ADDRESS_DETAILS);
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.addressEnterPostcode)
    );
    req.session.userCase.addressAddresses = response;
    req.session.userCase.addressAddressTypes = [];
    if (response !== undefined && response.length > 0) {
      req.session.userCase.addressAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSeveral : locales.selectDefaultSeveral,
      });
    } else if (response !== undefined && response.length === 1) {
      req.session.userCase.addressAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSingle : locales.selectDefaultSingle,
      });
    } else {
      req.session.userCase.addressAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultNone : locales.selectDefaultNone,
      });
    }
    if (response !== undefined) {
      for (const address of response) {
        req.session.userCase.addressAddressTypes.push({
          value: response.indexOf(address),
          label: address.fullAddress,
        });
      }
    }
    const content = getPageContent(req, this.postCodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    const link = req.url.includes('lng=cy')
      ? PageUrls.ADDRESS_DETAILS + '?lng=cy'
      : PageUrls.ADDRESS_DETAILS + '?lng=en';
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_POSTCODE_SELECT, {
      ...content,
      link,
    });
  };
}
