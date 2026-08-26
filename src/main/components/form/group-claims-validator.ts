import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant, CaseType, YesOrNo } from '../../definitions/case';
import { FormError } from '../../definitions/form';
import { getLogger } from '../../logger';

const logger = getLogger('GroupClaimsValidator');

function validateClaimantsNames(claimant: AdditionalClaimant, additionalClaimantErrors: FormError[]) {
  const hasFirstName = claimant?.firstName && claimant?.firstName.trim() !== '';
  const hasLastName = claimant?.lastName && claimant?.lastName.trim() !== '';

  if (!hasFirstName || !hasLastName) {
    logger.info('Validation error: Missing firstName or lastName for additional claimant.');
    additionalClaimantErrors.push({
      propertyName: 'hiddenErrorField',
      errorType: 'nameRequired',
    });
  }
}

function validateClaimantsAddresses(claimant: AdditionalClaimant, additionalClaimantErrors: FormError[]) {
  const address = claimant?.address;

  if (address) {
    const hasAddressLine1 = address?.AddressLine1 && address?.AddressLine1.trim() !== '';
    const hasCountry = address?.Country && address?.Country.trim() !== '';
    const hasPostTown = address?.PostTown && address?.PostTown.trim() !== '';

    if (!hasAddressLine1 || !hasCountry || !hasPostTown) {
      logger.info('Validation error: Missing mandatory address fields for additional claimant.');
      additionalClaimantErrors.push({
        propertyName: 'hiddenErrorField',
        errorType: 'addressRequired',
      });
    }
  } else {
    logger.info('Validation error: Missing address object for additional claimant.');
    additionalClaimantErrors.push({
      propertyName: 'hiddenErrorField',
      errorType: 'addressRequired',
    });
  }
}

export const validateAdditionalClaimants = (additionalClaimants: AdditionalClaimant[]): FormError[] => {
  const additionalClaimantErrors: FormError[] = [];

  // Validate structural data if claimants exist
  if (additionalClaimants && Array.isArray(additionalClaimants)) {
    for (const claimant of additionalClaimants) {
      // Validate Name Fields
      validateClaimantsNames(claimant, additionalClaimantErrors);

      // Validate Address Fields
      validateClaimantsAddresses(claimant, additionalClaimantErrors);
    }
  }

  return additionalClaimantErrors;
};

export const validateGroupClaimsCheckDetails = (req?: AppRequest, userCase?: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { caseType, additionalClaimants, leadClaimant, additionalClaimantSpreadsheet } = userCase;

  if (caseType === CaseType.SINGLE) {
    return true;
  }

  if (caseType !== CaseType.MULTIPLE) {
    return false;
  }

  const hasAdditionalClaimants =
    (Array.isArray(additionalClaimants) && additionalClaimants.length > 0) || Boolean(additionalClaimantSpreadsheet);
  const claimantErrors = additionalClaimants ? validateAdditionalClaimants(additionalClaimants) : [];
  const hasLeadClaimantSelection = leadClaimant === YesOrNo.YES || leadClaimant === YesOrNo.NO;
  const hasClaimantErrors = claimantErrors.length > 0;

  if (hasClaimantErrors) {
    logger.info('Redirecting to review page due to additional claimant validation failures.');
    req?.session?.errors?.push(...claimantErrors);
  }

  return !hasClaimantErrors && hasAdditionalClaimants && hasLeadClaimantSelection;
};
