import { Response } from 'express';

import { Form } from '../../components/form/form';
import { convertToDateObject } from '../../components/form/parser';
import { isFieldFilledIn } from '../../components/form/validator';
import { AdditionalClaimantCheck } from '../../decorators/AdditionalClaimantEditCheck';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant, CaseDate, YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { AdditionalClaimantDobFormFields, DateFormFields } from '../../definitions/dates';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord, UnknownRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handleUpdateDraftCase, setUserCase } from '../helpers/CaseHelpers';
import { returnSessionErrors } from '../helpers/ErrorHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';

const logger = getLogger('AdditionalClaimantPersonalDetailsController');

const dob_date: DateFormFields = {
  ...AdditionalClaimantDobFormFields,
  id: 'additionalClaimantDob',
  parser: (body: UnknownRecord): CaseDate => {
    const date = convertToDateObject('additionalClaimantDob', body);
    return { day: date.day ?? '', month: date.month ?? '', year: date.year ?? '' };
  },
};

export default class AdditionalClaimantPersonalDetailsController {
  private readonly form: Form;
  private readonly personalDetailsContent: FormContent = {
    fields: {
      additionalClaimantTitle: {
        id: 'additionalClaimantTitle',
        name: 'additionalClaimantTitle',
        type: 'text',
        label: (l: AnyRecord): string => l.titleLabel,
        classes: 'govuk-!-width-one-half',
        attributes: { maxLength: 50 },
      },
      additionalClaimantFirstName: {
        id: 'additionalClaimantFirstName',
        name: 'additionalClaimantFirstName',
        type: 'text',
        label: (l: AnyRecord): string => l.firstNameLabel,
        classes: 'govuk-!-width-one-half',
        attributes: { maxLength: 100 },
        validator: isFieldFilledIn,
      },
      additionalClaimantLastName: {
        id: 'additionalClaimantLastName',
        name: 'additionalClaimantLastName',
        type: 'text',
        label: (l: AnyRecord): string => l.lastNameLabel,
        classes: 'govuk-!-width-one-half',
        attributes: { maxLength: 100 },
        validator: isFieldFilledIn,
      },
      additionalClaimantEmail: {
        id: 'additionalClaimantEmail',
        name: 'additionalClaimantEmail',
        type: 'text',
        label: (l: AnyRecord): string => l.emailLabel,
        hint: (l: AnyRecord): string => l.emailHint,
        classes: 'govuk-!-width-one-half',
        attributes: { maxLength: 100 },
      },
      additionalClaimantDob: dob_date,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.personalDetailsContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const errors = returnSessionErrors(req, this.form);
    logger.info(
      `Handling additional claimant personal details submission. Existing claimant count: ${
        req.session.userCase.additionalClaimants?.length || 0
      }, current edit index: ${req.session.userCase.currentAdditionalClaimantIndex ?? 'new'}`
    );

    if (errors.length > 0) {
      logger.info(`Additional claimant personal details validation failed with ${errors.length} error(s)`);
      req.session.errors = errors;
      return res.redirect(setUrlLanguage(req, PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS));
    }

    req.session.errors = [];

    if (!req.session.userCase.additionalClaimants) {
      req.session.userCase.additionalClaimants = [];
    }

    const editIndex = req.session.userCase.currentAdditionalClaimantIndex;
    const isEditingExistingClaimant =
      editIndex !== undefined && editIndex < req.session.userCase.additionalClaimants.length;

    // Mirror the GET-handler guard: prevent adding a 6th claimant via direct POST
    if (!isEditingExistingClaimant && req.session.userCase.additionalClaimants.length >= 5) {
      return res.redirect(setUrlLanguage(req, PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    }

    // Use session data already populated by setUserCase — avoids re-parsing a consumed req.body
    const claimant: AdditionalClaimant = {
      title: req.session.userCase.additionalClaimantTitle,
      firstName: req.session.userCase.additionalClaimantFirstName,
      lastName: req.session.userCase.additionalClaimantLastName,
      email: req.session.userCase.additionalClaimantEmail,
      dob: req.session.userCase.additionalClaimantDob,
    };

    if (isEditingExistingClaimant) {
      this.setFieldsToEditAnExistingClaimant(req, editIndex, claimant);
    } else {
      this.setFieldsForANewClaimant(req, claimant);
    }
    const redirectUrl = isEditingExistingClaimant
      ? PageUrls.REVIEW_ADDITIONAL_CLAIMANTS
      : this.getPostcodeEnterUrlWithClaimantIndex(req.session.userCase.currentAdditionalClaimantIndex);
    logger.info(
      `Saved additional claimant personal details. Claimant count is now: ${
        req.session.userCase.additionalClaimants?.length || 0
      }. Redirecting to: ${redirectUrl}`
    );
    req.session.userCase.groupClaimsCheck = YesOrNo.NO;
    await handleUpdateDraftCase(req, logger);
    const { saveForLater } = req.body;
    if (saveForLater) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIM_SAVED));
    }
    return res.redirect(setUrlLanguage(req, redirectUrl));
  };

  @AdditionalClaimantCheck()
  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    logger.info(
      `Rendering additional claimant personal details page for ${
        req.query?.additionalClaimant
          ? `additional claimant index: ${req.query.additionalClaimant as string}`
          : 'a new claimant'
      }`
    );
    const content = getPageContent(req, this.personalDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS,
    ]);

    // Set editing index from query param (e.g. from Change link on review page)
    const indexParam = req.query?.additionalClaimant as string;
    if (indexParam !== undefined) {
      req.session.userCase.currentAdditionalClaimantIndex = parseInt(indexParam, 10);
    }
    this.populateFormFieldsForExistingClaimant(req);
    // Ensure date subfields (day/month/year) receive values from session state.
    assignFormData(req.session.userCase, this.form.getFormFields());

    res.render(TranslationKeys.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS, {
      ...content,
    });
  };

  /**
   * Loads an existing claimant's data back into the form fields.
   *
   * If a valid claimant is being edited, this copies their saved details
   * (like name, email, and address) into the session form fields so they
   * appear on screen. If the index is invalid, it resets the edit tracker.
   */
  private populateFormFieldsForExistingClaimant(req: AppRequest<Partial<AnyRecord>>) {
    // Pre-populate form if editing an existing claimant
    const editIndex = req.session.userCase?.currentAdditionalClaimantIndex;
    const claimants = req.session.userCase?.additionalClaimants;
    if (editIndex !== undefined && claimants && editIndex < claimants.length) {
      const c = claimants[editIndex];
      const address = c.address;
      req.session.userCase.additionalClaimantTitle = c.title;
      req.session.userCase.additionalClaimantFirstName = c.firstName;
      req.session.userCase.additionalClaimantLastName = c.lastName;
      req.session.userCase.additionalClaimantEmail = c.email;
      req.session.userCase.additionalClaimantDob = c.dob;
      req.session.userCase.additionalClaimantAddress1 = address?.AddressLine1;
      req.session.userCase.additionalClaimantAddress2 = address?.AddressLine2;
      req.session.userCase.additionalClaimantAddressTown = address?.PostTown;
      req.session.userCase.additionalClaimantAddressCountry = address?.Country;
      req.session.userCase.additionalClaimantAddressPostcode = address?.PostCode;
      req.session.userCase.additionalClaimantEnterPostcode = address?.PostCode;
    } else if (editIndex !== undefined && claimants && editIndex >= claimants.length) {
      req.session.userCase.currentAdditionalClaimantIndex = undefined;
    }
  }

  /**
   * Prepares the session to edit an existing claimant.
   *
   * It finds the claimant using the index, copies their existing
   * address details into the session and claimant forms, and updates
   * the list with the modified claimant.
   */
  private setFieldsToEditAnExistingClaimant(
    req: AppRequest<Partial<AnyRecord>>,
    editIndex: number,
    claimant: AdditionalClaimant
  ) {
    const existing = req.session.userCase.additionalClaimants[editIndex];
    const existingAddress = existing.address;
    claimant.address = existingAddress
      ? {
          AddressLine1: existingAddress.AddressLine1,
          AddressLine2: existingAddress.AddressLine2,
          PostTown: existingAddress.PostTown,
          Country: existingAddress.Country,
          PostCode: existingAddress.PostCode,
        }
      : undefined;
    req.session.userCase.additionalClaimantAddress1 = existingAddress?.AddressLine1;
    req.session.userCase.additionalClaimantAddress2 = existingAddress?.AddressLine2;
    req.session.userCase.additionalClaimantAddressTown = existingAddress?.PostTown;
    req.session.userCase.additionalClaimantAddressCountry = existingAddress?.Country;
    req.session.userCase.additionalClaimantAddressPostcode = existingAddress?.PostCode;
    req.session.userCase.additionalClaimantEnterPostcode = existingAddress?.PostCode;
    req.session.userCase.additionalClaimants[editIndex] = claimant;
  }

  /**
   * Prepares the session to add a new claimant.
   *
   * It saves the new claimant to the session list and clears out
   * any old address information so the form starts blank.
   */
  private setFieldsForANewClaimant(req: AppRequest<Partial<AnyRecord>>, claimant: AdditionalClaimant) {
    req.session.userCase.currentAdditionalClaimantIndex = req.session.userCase.additionalClaimants.length;
    req.session.userCase.additionalClaimants.push(claimant);
    req.session.userCase.additionalClaimantAddress1 = undefined;
    req.session.userCase.additionalClaimantAddress2 = undefined;
    req.session.userCase.additionalClaimantAddressTown = undefined;
    req.session.userCase.additionalClaimantAddressCountry = undefined;
    req.session.userCase.additionalClaimantAddressPostcode = undefined;
    req.session.userCase.additionalClaimantEnterPostcode = undefined;
    req.session.userCase.additionalClaimantAddressTypes = undefined;
    req.session.userCase.additionalClaimantAddresses = undefined;
  }

  private getPostcodeEnterUrlWithClaimantIndex(additionalClaimantIndex: number | undefined): string {
    if (additionalClaimantIndex === undefined) {
      return PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER;
    }
    return `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?additionalClaimant=${additionalClaimantIndex}`;
  }
}
