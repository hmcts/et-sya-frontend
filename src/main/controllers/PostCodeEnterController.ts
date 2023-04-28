import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

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
    const response = await getAddressesForPostcode(req.session.userCase.enterPostcode);
    req.session.userCase.addresses = response;
    req.session.userCase.addressTypes = [];
    if (response.length > 0) {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: 'several',
      });
    } else if (response.length === 1) {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: 'first',
      });
    } else {
      req.session.userCase.addressTypes.push({
        selected: true,
        label: 'none',
      });
    }
    for (const address of response) {
      req.session.userCase.addressTypes.push({
        selected: false,
        value: response.indexOf(address),
        label: address.fullAddress,
      });
    }
    await handlePostLogic(req, res, this.form, logger, PageUrls.POSTCODE_SELECT);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON, TranslationKeys.POSTCODE_ENTER]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.POSTCODE_ENTER, {
      ...content,
    });
  };
}
