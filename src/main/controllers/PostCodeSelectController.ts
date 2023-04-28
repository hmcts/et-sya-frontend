import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { AddressPageType } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
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
    const x = req.body.addresses;
    if (x !== undefined) {
      redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
    }
    switch (req.session.userCase.addressPageType) {
      case AddressPageType.RESPONDENT_ADDRESS: {
        redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_ADDRESS);
        break;
      }
      case AddressPageType.PLACE_OF_WORK: {
        redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
        break;
      }
      case AddressPageType.ADDRESS_DETAILS: {
        redirectUrl = PageUrls.ADDRESS_DETAILS;
        break;
      }
      default: {
        break;
      }
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.POSTCODE_SELECT,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.POSTCODE_SELECT, {
      ...content,
    });
  };
}
