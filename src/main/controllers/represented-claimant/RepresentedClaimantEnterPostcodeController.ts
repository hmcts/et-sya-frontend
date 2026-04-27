import { Response } from 'express';

import { getAddressesForPostcode } from '../../address';
import { isValidUKPostcode } from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { convertJsonArrayToTitleCase, handlePostLogic } from '../helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from '../helpers/FormHelpers';
import { getLink, getSelectTitle } from '../helpers/RepresentativePostCodeHelper';

const logger = getLogger('RepresentedClaimantEnterPostcodeController');

export default class RepresentedClaimantEnterPostcodeController {
  private readonly form: Form;
  private readonly claimantPostcodeSelectContent: FormContent = {
    fields: {
      representedClaimantEnterPostcode: {
        id: 'representedClaimantEnterPostcode',
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
    this.form = new Form(<FormFields>this.claimantPostcodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.userCase.representedClaimantAddresses = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.representedClaimantEnterPostcode)
    );
    const content = getPageContent(req, this.claimantPostcodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_ENTER_POSTCODE, {
      ...content,
      link: getLink(req),
      title: getSelectTitle(req),
    });
  };
}
