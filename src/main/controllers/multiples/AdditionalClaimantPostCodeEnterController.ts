import { Response } from 'express';

import { isValidUKPostcode } from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';

import {
  getAdditionalClaimantAddressLink,
  getAddressPageHeader,
  getEnterTitle,
} from '../helpers/AdditionalClaimantPostCodeHelper';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('AdditionalClaimantPostCodeEnterController');
const FULL_NAME_PLACEHOLDER = '[Full name of another claimant]';

export default class AdditionalClaimantPostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      additionalClaimantEnterPostcode: {
        id: 'additionalClaimantEnterPostcode',
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
    const indexParam = req.query?.index as string;
    if (indexParam !== undefined) {
      req.session.userCase.currentAdditionalClaimantIndex = parseInt(indexParam, 10);
    }

    const editIndex = req.session.userCase.currentAdditionalClaimantIndex;
    const currentClaimant = editIndex === undefined ? undefined : req.session.userCase.additionalClaimants?.[editIndex];
    const enteredPostcode = req.body?.additionalClaimantEnterPostcode as string | undefined;
    if (
      currentClaimant &&
      enteredPostcode?.trim() &&
      this.normalisePostcode(enteredPostcode) !== this.normalisePostcode(currentClaimant.address?.PostCode)
    ) {
      this.clearAdditionalClaimantAddressSelection(req);
    }
    return handlePostLogic(req, res, this.form, logger, PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT, true);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const indexParam = req.query?.index as string;
    if (indexParam !== undefined) {
      req.session.userCase.currentAdditionalClaimantIndex = parseInt(indexParam, 10);
      req.session.userCase.additionalClaimantAddressTypes = undefined;
      req.session.userCase.additionalClaimantAddresses = undefined;
    }

    const editIndex = req.session.userCase.currentAdditionalClaimantIndex;
    const currentClaimant = editIndex === undefined ? undefined : req.session.userCase.additionalClaimants?.[editIndex];
    if (currentClaimant?.address) {
      req.session.userCase.additionalClaimantAddress1 = currentClaimant.address.AddressLine1;
      req.session.userCase.additionalClaimantAddress2 = currentClaimant.address.AddressLine2;
      req.session.userCase.additionalClaimantAddressTown = currentClaimant.address.PostTown;
      req.session.userCase.additionalClaimantAddressCountry = currentClaimant.address.Country;
      req.session.userCase.additionalClaimantAddressPostcode = currentClaimant.address.PostCode;
      req.session.userCase.additionalClaimantEnterPostcode = currentClaimant.address.PostCode;
    }

    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_POSTCODE_ENTER, {
      ...content,
      addressPageHeader: this.getAddressPageHeaderWithClaimantName(req, currentClaimant),
      link: getAdditionalClaimantAddressLink(req),
      title: getEnterTitle(req),
    });
  };

  /**
   * Cleans up a postcode string to make it easier to compare.
   *
   * It removes all spaces and converts the text to uppercase (e.g., "sa1 1aa" becomes "SA11AA").
   * If the postcode is missing, it returns an empty string.
   */
  private readonly normalisePostcode = (postcode: string | undefined): string => {
    return (postcode || '').replace(/\s+/g, '').toUpperCase();
  };

  /**
   * Clears out any selected or entered address data for the claimant from the session.
   *
   * This wipes the address lines, city, country, postcode, and any dropdown options
   * to completely reset the address form.
   */
  private readonly clearAdditionalClaimantAddressSelection = (req: AppRequest): void => {
    req.session.userCase.additionalClaimantAddress1 = undefined;
    req.session.userCase.additionalClaimantAddress2 = undefined;
    req.session.userCase.additionalClaimantAddressTown = undefined;
    req.session.userCase.additionalClaimantAddressCountry = undefined;
    req.session.userCase.additionalClaimantAddressPostcode = undefined;
    req.session.userCase.additionalClaimantAddressTypes = undefined;
    req.session.userCase.additionalClaimantAddresses = undefined;
  };

  /**
   * Creates the heading text for the address page, adding the claimant's name.
   *
   * It takes the standard page heading and inserts or appends the claimant's
   * full name if it exists. If no name is found, it removes the name placeholder
   * from the heading.
   */
  private readonly getAddressPageHeaderWithClaimantName = (
    req: AppRequest,
    currentClaimant: AdditionalClaimant | undefined
  ): string => {
    const baseHeader = getAddressPageHeader(req);
    const fullName = this.getAdditionalClaimantFullName(req, currentClaimant);
    if (!fullName) {
      return baseHeader.replace(FULL_NAME_PLACEHOLDER, '').trim();
    }
    if (baseHeader.includes(FULL_NAME_PLACEHOLDER)) {
      return baseHeader.replace(FULL_NAME_PLACEHOLDER, fullName);
    }
    return `${baseHeader} ${fullName}`.trim();
  };

  /**
   * Gets the claimant's full name by joining their first and last name.
   *
   * It looks for the names on the provided claimant object first. If they
   * aren't there, it checks the session form fields instead.
   */
  private readonly getAdditionalClaimantFullName = (
    req: AppRequest,
    currentClaimant: AdditionalClaimant | undefined
  ): string => {
    const firstName = currentClaimant?.firstName || req.session.userCase.additionalClaimantFirstName;
    const lastName = currentClaimant?.lastName || req.session.userCase.additionalClaimantLastName;
    return `${firstName || ''} ${lastName || ''}`.trim();
  };
}
