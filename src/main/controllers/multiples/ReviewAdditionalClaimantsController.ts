import { Response } from 'express';

import { Form } from '../../components/form/form';
import { validateAdditionalClaimants } from '../../components/form/group-claims-validator';
import { isFieldFilledIn } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { getPageContent } from '../helpers/FormHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  ClaimantSummaryCard,
  clearAdditionalClaimantTransientFields,
  formatAddress,
  formatDob,
  formatName,
} from '../helpers/multiples/ReviewAdditionalClaimantsHelper';

const logger = getLogger('ReviewAdditionalClaimantsController');
const MAX_ADDITIONAL_CLAIMANTS = 5;

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
      addAdditionalClaimantMaxTxt: {
        id: 'add-another-claimant-txt',
        classes: 'govuk-body',
        type: 'readonly',
        hint: (l: AnyRecord): string => l.p3 + l.spreadsheetOptionLink,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.reviewContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // 1. Run all claimant data validation
    const claimantErrors = validateAdditionalClaimants(req);
    const additionalClaimantCount = req.session?.userCase?.additionalClaimants?.length || 0;
    req.session.errors = req.session.errors || [];

    // When max claimants are reached, the radios are hidden and we implicitly continue.
    if (additionalClaimantCount >= MAX_ADDITIONAL_CLAIMANTS && !req.body.addAdditionalClaimant) {
      req.body.addAdditionalClaimant = YesOrNo.NO;
      req.session.userCase.addAdditionalClaimant = YesOrNo.NO;
    }

    // 2. Error redirects with validation failures
    if (claimantErrors.length > 0) {
      req.session.errors.push(...claimantErrors);
      req.session.userCase.addAdditionalClaimant = undefined; // Clear the user's selection on error to prevent confusion on return
      return res.redirect(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS + getLanguageParam(req.url));
    }

    if (req.body.addAdditionalClaimant === YesOrNo.NO && additionalClaimantCount === 0) {
      req.session.errors.push({
        propertyName: 'hiddenErrorField',
        errorType: 'additionalClaimantRequired',
      });
      req.session.userCase.addAdditionalClaimant = YesOrNo.YES; // Pre-select yes as there should be an additional claimant
      return res.redirect(setUrlLanguage(req, PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    }

    // 3. Standard routing rules on successful validation
    let redirectUrl;
    if (req.body.addAdditionalClaimant === YesOrNo.NO || additionalClaimantCount >= MAX_ADDITIONAL_CLAIMANTS) {
      redirectUrl = setUrlLanguage(req, PageUrls.GROUP_REPRESENTATIVE);
    } else {
      redirectUrl = setUrlLanguage(
        req,
        `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?additionalClaimant=new-claimant`
      );
    }

    // 3. Clear transient fields and pass off to baseline framework handler
    clearAdditionalClaimantTransientFields(req);

    // Re-enable creation flow for the next claimant (flag was reset by the clear above)
    if (req.body.addAdditionalClaimant === YesOrNo.YES && additionalClaimantCount < MAX_ADDITIONAL_CLAIMANTS) {
      req.session.additionalClaimantNewFlow = true;
    }

    return handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const claimants = req.session.userCase?.additionalClaimants || [];
    const canAddAnotherClaimant = claimants.length < MAX_ADDITIONAL_CLAIMANTS;
    const content = getPageContent(req, this.getReviewContent(req, canAddAnotherClaimant), [
      TranslationKeys.COMMON,
      TranslationKeys.REVIEW_ADDITIONAL_CLAIMANTS,
    ]);
    const languageParam = req.url?.includes('lng=cy') ? '?lng=cy' : '';
    const userCase = req.session?.userCase;
    let additionalClaimants: ClaimantSummaryCard[] = [];

    if (!userCase?.additionalClaimantSpreadsheet) {
      additionalClaimants = claimants.map((c, index) => ({
        name: formatName(c),
        dob: formatDob(c.dob),
        address: formatAddress(c),
        email: c.email || '',
        removeUrl: `${PageUrls.REMOVE_ADDITIONAL_CLAIMANT}?additionalClaimant=${index}${
          languageParam ? '&' + languageParam.substring(1) : ''
        }`,
        changeNameUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?additionalClaimant=${index}${
          languageParam ? '&' + languageParam.substring(1) : ''
        }`,
        changeDobUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?additionalClaimant=${index}${
          languageParam ? '&' + languageParam.substring(1) : ''
        }`,
        changeAddressUrl: `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}?additionalClaimant=${index}${
          languageParam ? '&' + languageParam.substring(1) : ''
        }`,
        changeEmailUrl: `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?additionalClaimant=${index}${
          languageParam ? '&' + languageParam.substring(1) : ''
        }`,
      }));
    }

    // Clear the editing index when arriving at review
    req.session.userCase.currentAdditionalClaimantIndex = undefined;

    res.render(TranslationKeys.REVIEW_ADDITIONAL_CLAIMANTS, {
      ...content,
      additionalClaimants,
      canAddAnotherClaimant,
      additionalClaimantsSpreadsheet: userCase?.additionalClaimantSpreadsheet,
      changeSpreadsheetUrl: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
    });
  };

  private readonly getReviewContent = (req: AppRequest, canAddAnotherClaimant: boolean): FormContent => {
    if (typeof this.reviewContent.fields === 'function') {
      return this.reviewContent;
    }

    const hasSpreadsheet = !!req.session.userCase?.additionalClaimantSpreadsheet;
    const fields: FormFields = { ...this.reviewContent.fields };
    if (hasSpreadsheet) {
      delete fields.addAdditionalClaimant;
      delete fields.addAdditionalClaimantMaxTxt;
    } else if (canAddAnotherClaimant) {
      delete fields.addAdditionalClaimantMaxTxt;
    } else {
      const addAnotherClaimantUrl = `${PageUrls.ADD_ANOTHER_CLAIMANT}${getLanguageParam(req.url)}`;
      fields.addAdditionalClaimantMaxTxt = {
        ...fields.addAdditionalClaimantMaxTxt,
        hint: (l: AnyRecord): string =>
          `${l.p3} <a class="govuk-link" href="${addAnotherClaimantUrl}">${l.spreadsheetOptionLink}</a>`,
      };
      delete fields.addAdditionalClaimant;
    }

    return { ...this.reviewContent, fields };
  };
}
