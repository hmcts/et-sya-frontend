import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant, CaseDate, YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { getPageContent } from '../helpers/FormHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';

const logger = getLogger('ReviewAdditionalClaimantsController');
const MAX_ADDITIONAL_CLAIMANTS = 5;

interface ClaimantSummaryCard {
  name: string;
  dob: string;
  address: string;
  email: string;
  removeUrl: string;
  changeNameUrl: string;
  changeDobUrl: string;
  changeAddressUrl: string;
  changeEmailUrl: string;
}

const formatDob = (dob?: CaseDate): string => {
  if (!dob || (!dob.day && !dob.month && !dob.year)) {
    return '';
  }
  return `${dob.day}/${dob.month}/${dob.year}`;
};

const formatAddress = (c: AdditionalClaimant): string => {
  const parts = [
    c.address.AddressLine1,
    c.address.AddressLine2,
    c.address.PostTown,
    c.address.Country,
    c.address.PostCode,
  ].filter(Boolean);
  return parts.join('<br>');
};

const formatName = (c: AdditionalClaimant): string => {
  const parts = [c.title, c.firstName, c.lastName].filter(Boolean);
  return parts.join(' ');
};

const clearAdditionalClaimantTransientFields = (req: AppRequest): void => {
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

export default class ReviewAdditionalClaimantsController {
  private readonly form: Form;
  private readonly reviewContent: FormContent = {
    fields: {
      addAdditionalClaimant: {
        classes: 'govuk-radios--inline',
        id: 'add-another-claimant-radio',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.reviewContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const additionalClaimantCount = req.session.userCase?.additionalClaimants?.length || 0;
    logger.info(
      `Handling review other claimants submission. Add another claimant answer: ${
        req.body.addAdditionalClaimant || 'none'
      }`
    );
    clearAdditionalClaimantTransientFields(req);
    if (additionalClaimantCount >= MAX_ADDITIONAL_CLAIMANTS) {
      logger.info('Maximum additional claimant limit reached. Redirecting to claim details check page');
      return res.redirect(setUrlLanguage(req, PageUrls.GROUP_REPRESENTATIVE));
    }
    if (req.body.addAdditionalClaimant === YesOrNo.YES) {
      logger.info('Redirecting from review other claimants to other claimant personal details page');
      return handlePostLogic(req, res, this.form, logger, PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
    }
    logger.info('Redirecting from review other claimants to claim details check page');
    return handlePostLogic(req, res, this.form, logger, PageUrls.GROUP_REPRESENTATIVE);
  };

  public get = (req: AppRequest, res: Response): void => {
    logger.info(
      `Rendering review other claimants page. Current claimant count: ${
        req.session.userCase?.additionalClaimants?.length || 0
      }`
    );
    const content = getPageContent(req, this.reviewContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REVIEW_ADDITIONAL_CLAIMANTS,
    ]);

    const claimants = req.session.userCase?.additionalClaimants || [];
    const canAddAnotherClaimant = claimants.length < MAX_ADDITIONAL_CLAIMANTS;
    const languageParam = req.url?.includes('lng=cy') ? '?lng=cy' : '';

    const additionalClaimants: ClaimantSummaryCard[] = claimants.map((c, index) => ({
      name: formatName(c),
      dob: formatDob(c.dob),
      address: formatAddress(c),
      email: c.email || '',
      removeUrl: `${PageUrls.REMOVE_ADDITIONAL_CLAIMANT}?index=${index}${
        languageParam ? '&' + languageParam.substring(1) : ''
      }`,
      changeNameUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=${index}${
        languageParam ? '&' + languageParam.substring(1) : ''
      }`,
      changeDobUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=${index}${
        languageParam ? '&' + languageParam.substring(1) : ''
      }`,
      changeAddressUrl: `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?index=${index}${
        languageParam ? '&' + languageParam.substring(1) : ''
      }`,
      changeEmailUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?index=${index}${
        languageParam ? '&' + languageParam.substring(1) : ''
      }`,
    }));

    // Clear the editing index when arriving at review
    req.session.userCase.currentAdditionalClaimantIndex = undefined;

    res.render(TranslationKeys.REVIEW_ADDITIONAL_CLAIMANTS, {
      ...content,
      additionalClaimants,
      canAddAnotherClaimant,
    });
  };
}
