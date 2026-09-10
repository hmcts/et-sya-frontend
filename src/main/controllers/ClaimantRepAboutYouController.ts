import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../components/form/address-validator';
import { validateClaimantRepAboutYou } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { isFieldFilledIn, isValidEmailAddress, isValidUKTelNumber } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormOptions } from '../definitions/form';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import {
  convertJsonArrayToTitleCase,
  handleUpdateClaimantRepAboutYou,
  handleUpdateHubLinksStatuses,
  setUserCase,
} from './helpers/CaseHelpers';
import {
  applySelectedAddress,
  clearRepAboutYouFlow,
  loadClaimantRepCase,
  rememberRepAboutYouEdits,
} from './helpers/ClaimantRepAboutYouHelper';
import { handleErrors, returnSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRepresentativeAddressTypes } from './helpers/RepresentativePostCodeHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRepAboutYouController');

export default class ClaimantRepAboutYouController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      representativeName: {
        id: 'representativeName',
        name: 'representativeName',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.name,
        labelSize: 's',
        attributes: { maxLength: 100 },
        validator: isFieldFilledIn,
      },
      representativeOrgName: {
        id: 'representativeOrgName',
        name: 'representativeOrgName',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.organisation,
        labelSize: 's',
        attributes: { maxLength: 100 },
      },
      representativeType: {
        id: 'representativeType',
        type: 'option',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.typeOfRepresentative,
        labelSize: 's',
        values: [
          { label: (l: AnyRecord): string => l.selectAType, value: '' },
          { label: (l: AnyRecord): string => l.employmentAdvisor, value: 'Employment Advisor' },
          { label: (l: AnyRecord): string => l.citizensAdviceBureau, value: 'Citizens Advice Bureau' },
          { label: (l: AnyRecord): string => l.freeRepresentationUnit, value: 'Free Representation Unit' },
          { label: (l: AnyRecord): string => l.lawCentre, value: 'Law Centre' },
          { label: (l: AnyRecord): string => l.tradeUnion, value: 'Trade Union' },
          { label: (l: AnyRecord): string => l.solicitor, value: 'Solicitor' },
          { label: (l: AnyRecord): string => l.privateIndividual, value: 'Private Individual' },
          { label: (l: AnyRecord): string => l.tradeAssociation, value: 'Trade Association' },
          { label: (l: AnyRecord): string => l.other, value: 'Other' },
        ],
        validator: isFieldFilledIn,
      },
      representativeEnterPostcode: {
        id: 'representativeEnterPostcode',
        name: 'representativeEnterPostcode',
        type: 'postcode-lookup',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.enterPostcode,
        labelSize: 's',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
      },
      representativeAddressTypes: {
        id: 'representativeAddressTypes',
        type: 'address-select',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.selectAddress,
        labelSize: 's',
        values: [],
      },
      repAddress1: {
        id: 'repAddress1',
        name: 'repAddress1',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.buildingAndStreet,
        labelSize: 's',
        attributes: {
          autocomplete: 'address-line1',
          maxLength: 150,
        },
        validator: isValidAddressFirstLine,
      },
      repAddress2: {
        id: 'repAddress2',
        name: 'repAddress2',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.addressLine2,
        labelSize: 's',
        attributes: {
          autocomplete: 'address-line2',
          maxLength: 50,
        },
        validator: isValidAddressSecondLine,
      },
      repAddressTown: {
        id: 'repAddressTown',
        name: 'repAddressTown',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.addressLine3,
        labelSize: 's',
        attributes: {
          autocomplete: 'address-level2',
          maxLength: 50,
        },
        validator: isValidCountryTownOrCity,
      },
      repAddressPostcode: {
        id: 'repAddressPostcode',
        name: 'repAddressPostcode',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.postcode,
        labelSize: 's',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
      },
      claimantRepEmail: {
        id: 'claimantRepEmail',
        name: 'claimantRepEmail',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.email,
        labelSize: 's',
        attributes: {
          autocomplete: 'email',
          maxLength: 100,
        },
        validator: isValidEmailAddress,
      },
      representativePhoneNumber: {
        id: 'representativePhoneNumber',
        name: 'representativePhoneNumber',
        type: 'tel',
        classes: 'govuk-input--width-20',
        label: (l: AnyRecord): string => l.phone,
        labelSize: 's',
        attributes: {
          autocomplete: 'tel',
        },
        validator: isValidUKTelNumber,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  /**
   * Lists the addresses found by the last postcode lookup so they can be picked from the same page.
   * The list is rebuilt on every request, so it disappears once the lookup is cleared.
   */
  private setFoundAddresses = (userCase: CaseWithId, req: AppRequest): void => {
    const addresses = userCase.representativeAddresses;
    const field = <FormOptions>(<FormFields>this.formContent.fields).representativeAddressTypes;
    field.values = addresses ? getRepresentativeAddressTypes(addresses, req) : [];
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await loadClaimantRepCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    setUserCase(req, this.form);

    if (req.body?.findAddress) {
      return this.findAddress(req, res, caseId);
    }

    if (req.body?.selectAddress) {
      applySelectedAddress(req.session.userCase);
      rememberRepAboutYouEdits(req);
      req.session.errors = [];
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    // A selection the representative left in the list is still theirs to keep, so it is validated
    // and saved alongside everything else they typed
    if (applySelectedAddress(req.session.userCase)) {
      const { repAddress1, repAddress2, repAddressTown, repAddressPostcode } = req.session.userCase;
      Object.assign(req.body, { repAddress1, repAddress2, repAddressTown, repAddressPostcode });
    }

    req.session.errors = [];
    const errors = returnSessionErrors(req, this.form);
    if (errors.length) {
      return handleErrors(req, res, errors);
    }

    if (!validateClaimantRepAboutYou(req.session.userCase)) {
      req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'invalid' });
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    await handleUpdateClaimantRepAboutYou(req, logger);
    if (req.session.userCase.updateDraftCaseError) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    if (!req.session.userCase.hubLinksStatuses) {
      req.session.userCase.hubLinksStatuses = {};
    }
    req.session.userCase.hubLinksStatuses[HubLinkNames.AboutYou] = HubLinkStatus.VIEWED;
    await handleUpdateHubLinksStatuses(req, logger);
    clearRepAboutYouFlow(req);

    return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId)));
  };

  /**
   * The postcode lookup shares the About you form, so only the lookup postcode is validated before
   * the matching addresses are listed further down the same page.
   */
  private findAddress = async (req: AppRequest, res: Response, caseId: string): Promise<void> => {
    const userCase = req.session.userCase;
    const errorType = isValidUKPostcode(userCase.representativeEnterPostcode, req.body);
    if (errorType) {
      return handleErrors(req, res, [{ propertyName: 'representativeEnterPostcode', errorType: errorType as string }]);
    }

    try {
      userCase.representativeAddresses = convertJsonArrayToTitleCase(
        await getAddressesForPostcode(userCase.representativeEnterPostcode)
      );
    } catch (error) {
      logger.error(`Error looking up postcode for case ${caseId}: ${error.message}`);
      userCase.representativeAddresses = [];
    }
    userCase.representativeAddressTypes = undefined;
    rememberRepAboutYouEdits(req);

    req.session.errors = [];
    return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await loadClaimantRepCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);

    // An address picked on the postcode select page arrives back here as the selected index
    applySelectedAddress(userCase);
    this.setFoundAddresses(userCase, req);

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_REP_ABOUT_YOU,
    ]);
    assignFormData(userCase, this.form.getFormFields());

    res.render(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, {
      ...content,
      languageParam,
      backLinkUrl: PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId) + languageParam,
      cancelLink: PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId) + languageParam,
    });
  };
}
