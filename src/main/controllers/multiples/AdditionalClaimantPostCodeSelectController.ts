import { Response } from 'express';

import { getAddressesForPostcode } from '../../address';
import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import {
  getAdditionalClaimantAddressLink,
  getAdditionalClaimantAddressTypes,
  getSelectTitle,
} from '../helpers/AdditionalClaimantPostCodeHelper';
import { convertJsonArrayToTitleCase, handleUpdateDraftCase, setUserCase } from '../helpers/CaseHelpers';
import { handleErrors, returnSessionErrors } from '../helpers/ErrorHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';

const logger = getLogger('AdditionalClaimantPostCodeSelectController');

export default class AdditionalClaimantPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      additionalClaimantAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'additionalClaimantAddressTypes',
        label: l => l.selectAddress,
        labelSize: 'xl',
        isPageHeading: true,
        hint: l => l.selectAddressHint,
      },
      additionalClaimantAddress1: {
        id: 'additionalClaimantAddress1',
        name: 'address-line1',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine1,
        labelSize: null,
        validator: isValidAddressFirstLine,
        attributes: {
          autocomplete: 'address-line1',
          maxLength: 150,
        },
      },
      additionalClaimantAddress2: {
        id: 'additionalClaimantAddress2',
        name: 'address-line2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine2,
        labelSize: null,
        validator: isValidAddressSecondLine,
        attributes: {
          autocomplete: 'address-line2',
          maxLength: 50,
        },
      },
      additionalClaimantAddressTown: {
        id: 'additionalClaimantAddressTown',
        name: 'address-town',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.town,
        labelSize: null,
        validator: isValidCountryTownOrCity,
        attributes: {
          autocomplete: 'address-level2',
          maxLength: 50,
        },
      },
      additionalClaimantAddressCountry: {
        id: 'additionalClaimantAddressCountry',
        name: 'address-country',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.country,
        labelSize: null,
        validator: isValidCountryTownOrCity,
        attributes: {
          maxLength: 50,
        },
      },
      additionalClaimantAddressPostcode: {
        id: 'additionalClaimantAddressPostcode',
        name: 'address-postcode',
        type: 'text',
        classes: 'govuk-label govuk-input--width-10',
        label: l => l.postcode,
        labelSize: null,
        validator: isValidUKPostcode,
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const errors = returnSessionErrors(req, this.form);
    if (errors.length > 0) {
      handleErrors(req, res, errors);
      return;
    }
    req.session.errors = [];

    if (!req.session.userCase.additionalClaimants) {
      req.session.userCase.additionalClaimants = [];
    }

    let editIndex = req.session.userCase.currentAdditionalClaimantIndex;
    if (editIndex === undefined || editIndex >= req.session.userCase.additionalClaimants.length) {
      editIndex = req.session.userCase.additionalClaimants.length;
      req.session.userCase.currentAdditionalClaimantIndex = editIndex;
      req.session.userCase.additionalClaimants.push({
        title: req.session.userCase.additionalClaimantTitle,
        firstName: req.session.userCase.additionalClaimantFirstName,
        lastName: req.session.userCase.additionalClaimantLastName,
        email: req.session.userCase.additionalClaimantEmail,
        dob: req.session.userCase.additionalClaimantDob,
      });
    }

    const claimant = req.session.userCase.additionalClaimants[editIndex] || ({} as AdditionalClaimant);
    if (!claimant.address) {
      claimant.address = {} as AdditionalClaimant['address'];
    }
    claimant.address.AddressLine1 = req.session.userCase.additionalClaimantAddress1;
    claimant.address.AddressLine2 = req.session.userCase.additionalClaimantAddress2;
    claimant.address.PostTown = req.session.userCase.additionalClaimantAddressTown;
    claimant.address.Country = req.session.userCase.additionalClaimantAddressCountry;
    claimant.address.PostCode = req.session.userCase.additionalClaimantAddressPostcode;
    req.session.userCase.additionalClaimants[editIndex] = claimant;

    await handleUpdateDraftCase(req, logger);
    if (req.body?.saveForLater) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIM_SAVED));
    }
    this.clearAdditionalClaimantTransientFields(req);
    return res.redirect(setUrlLanguage(req, PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedAddressType = req.session.userCase.additionalClaimantAddressTypes;
    const indexParam = req.query?.index as string;
    if (indexParam !== undefined) {
      req.session.userCase.currentAdditionalClaimantIndex = parseInt(indexParam, 10);
    }
    const editIndex = req.session.userCase.currentAdditionalClaimantIndex;
    const currentClaimant = editIndex === undefined ? undefined : req.session.userCase.additionalClaimants?.[editIndex];
    if (
      currentClaimant?.address &&
      !this.hasAnyAddressFieldValue(req.session.userCase as unknown as AnyRecord) &&
      !this.hasEnteredDifferentPostcodeToCurrentClaimant(currentClaimant, req.session.userCase as unknown as AnyRecord)
    ) {
      req.session.userCase.additionalClaimantAddress1 = currentClaimant.address.AddressLine1;
      req.session.userCase.additionalClaimantAddress2 = currentClaimant.address.AddressLine2;
      req.session.userCase.additionalClaimantAddressTown = currentClaimant.address.PostTown;
      req.session.userCase.additionalClaimantAddressCountry = currentClaimant.address.Country;
      req.session.userCase.additionalClaimantAddressPostcode = currentClaimant.address.PostCode;
      if (!req.session.userCase.additionalClaimantEnterPostcode) {
        req.session.userCase.additionalClaimantEnterPostcode = currentClaimant.address.PostCode;
      }
    }

    const response = convertJsonArrayToTitleCase(
      await getAddressesForPostcode(req.session.userCase.additionalClaimantEnterPostcode)
    );
    req.session.userCase.additionalClaimantAddresses = response;
    req.session.userCase.additionalClaimantAddressTypes = getAdditionalClaimantAddressTypes(response, req);
    if (!this.hasAnyAddressFieldValue(req.session.userCase as unknown as AnyRecord)) {
      this.fillAdditionalClaimantAddressFields(selectedAddressType, req);
    }

    if (selectedAddressType !== undefined && !Array.isArray(selectedAddressType)) {
      const selectedAddressIndex = parseInt(`${selectedAddressType}`, 10);
      if (
        !Number.isNaN(selectedAddressIndex) &&
        req.session.userCase.additionalClaimantAddressTypes[selectedAddressIndex + 1]
      ) {
        req.session.userCase.additionalClaimantAddressTypes.forEach(addressType => {
          addressType.selected = false;
        });
        req.session.userCase.additionalClaimantAddressTypes[selectedAddressIndex + 1].selected = true;
      }
    }

    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ENTER_ADDRESS,
      TranslationKeys.ADDITIONAL_CLAIMANT_ADDRESS_DETAILS,
    ]);
    const formFields = this.form.getFormFields();
    if (req.session.userCase.additionalClaimantAddressTypes) {
      formFields.additionalClaimantAddressTypes.values = req.session.userCase.additionalClaimantAddressTypes;
    }
    assignFormData(req.session.userCase, formFields);
    res.render(TranslationKeys.ADDRESS_POSTCODE_SELECT, {
      ...content,
      link: getAdditionalClaimantAddressLink(req),
      title: getSelectTitle(req),
    });
  };

  normalisePostcode = (postcode: string | undefined): string => {
    return (postcode || '').replace(/\s+/g, '').toUpperCase();
  };

  hasAnyAddressFieldValue = (formData: AnyRecord): boolean => {
    return [
      formData.additionalClaimantAddress1,
      formData.additionalClaimantAddress2,
      formData.additionalClaimantAddressTown,
      formData.additionalClaimantAddressCountry,
      formData.additionalClaimantAddressPostcode,
    ].some(value => value !== undefined && value !== null && `${value}`.trim().length > 0);
  };

  hasEnteredDifferentPostcodeToCurrentClaimant = (
    currentClaimant: AdditionalClaimant | undefined,
    formData: AnyRecord
  ): boolean => {
    if (!currentClaimant) {
      return false;
    }
    const enteredPostcode = this.normalisePostcode(formData.additionalClaimantEnterPostcode as string | undefined);
    const currentClaimantPostcode = this.normalisePostcode(currentClaimant?.address?.PostCode);
    return (
      enteredPostcode.length > 0 && currentClaimantPostcode.length > 0 && enteredPostcode !== currentClaimantPostcode
    );
  };

  fillAdditionalClaimantAddressFields = (selectedAddressType: unknown, req: AppRequest): void => {
    const selectedAddressIndex = parseInt(`${selectedAddressType}`, 10);
    if (Number.isNaN(selectedAddressIndex)) {
      return;
    }
    const selectedAddress = req.session.userCase.additionalClaimantAddresses?.[selectedAddressIndex];
    if (!selectedAddress) {
      return;
    }
    req.session.userCase.additionalClaimantAddress1 = selectedAddress.street1;
    req.session.userCase.additionalClaimantAddress2 = selectedAddress.street2;
    req.session.userCase.additionalClaimantAddressTown = selectedAddress.town;
    req.session.userCase.additionalClaimantAddressCountry = selectedAddress.country;
    req.session.userCase.additionalClaimantAddressPostcode = selectedAddress.postcode;
  };

  clearAdditionalClaimantTransientFields = (req: AppRequest): void => {
    req.session.userCase.currentAdditionalClaimantIndex = undefined;
    req.session.userCase.additionalClaimantTitle = undefined;
    req.session.userCase.additionalClaimantFirstName = undefined;
    req.session.userCase.additionalClaimantLastName = undefined;
    req.session.userCase.additionalClaimantEmail = undefined;
    req.session.userCase.additionalClaimantDob = undefined;
    req.session.userCase.additionalClaimantAddress1 = undefined;
    req.session.userCase.additionalClaimantAddress2 = undefined;
    req.session.userCase.additionalClaimantAddressTown = undefined;
    req.session.userCase.additionalClaimantAddressCountry = undefined;
    req.session.userCase.additionalClaimantAddressPostcode = undefined;
    req.session.userCase.additionalClaimantEnterPostcode = undefined;
    req.session.userCase.additionalClaimantAddressTypes = undefined;
    req.session.userCase.additionalClaimantAddresses = undefined;
  };
}
