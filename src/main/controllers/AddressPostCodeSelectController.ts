import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { getAddressAddressTypes, getLink, getSelectTitle } from './helpers/AddressPostCodeHelper';
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.ADDRESS_DETAILS);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.addressEnterPostcode)
    );
    req.session.userCase.addressAddresses = response;
    req.session.userCase.addressAddressTypes = getAddressAddressTypes(response, req);
    const content = getPageContent(req, this.postCodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_POSTCODE_SELECT, {
      ...content,
      link: getLink(req),
      title: getSelectTitle(req),
    });
  };
}
