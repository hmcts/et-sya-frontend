import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { getEnterTitle, getLink } from './helpers/AddressPostCodeHelper';
import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('AddressPostCodeEnterController');

export default class AddressPostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      addressEnterPostcode: {
        id: 'addressEnterPostcode',
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.ADDRESS_POSTCODE_SELECT);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_POSTCODE_ENTER, {
      ...content,
      link: getLink(req),
      title: getEnterTitle(req),
    });
  };
}
