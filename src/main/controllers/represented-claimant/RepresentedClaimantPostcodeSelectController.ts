import { Response } from 'express';

import { getAddressesForPostcode } from '../../address';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { convertJsonArrayToTitleCase, handlePostLogic } from '../helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from '../helpers/FormHelpers';
import { getLink, getRepresentativeAddressTypes, getSelectTitle } from '../helpers/RepresentativePostCodeHelper';

const logger = getLogger('RepresentedClaimantPostcodeSelectController');

export default class RepresentedClaimantPostcodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      representativeAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'representativeAddressTypes',
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.representedClaimantEnterPostcode)
    );
    req.session.userCase.representedClaimantAddresses = response;
    req.session.userCase.representedClaimantAddressTypes = getRepresentativeAddressTypes(response, req);
    const content = getPageContent(req, this.postCodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_POSTCODE_SELECT, {
      ...content,
      link: getLink(req),
      title: getSelectTitle(req),
    });
  };
}
