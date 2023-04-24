import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { getAddresses } from './helpers/AddressPostCodeHelper';
import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('PostCodeSelectController');

export default class PostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      addresses: {
        id: 'addresses',
        type: 'option',
        classes: 'govuk-select',
        label: l => l.postcode,
        labelSize: null,
        values: [],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.PLACE_OF_WORK);
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const addresses = getAddresses(req.session.userCase);
    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.POSTCODE_SELECT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.POSTCODE_SELECT, {
      ...content,
      addresses,
    });
  };
}
