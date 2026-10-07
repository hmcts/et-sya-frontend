import { AppRequest } from '../../../definitions/appRequest';
import { AdditionalClaimant, CaseDate } from '../../../definitions/case';

export interface ClaimantSummaryCard {
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

export const formatDob = (dob?: CaseDate): string => {
  if (!dob || (!dob.day && !dob.month && !dob.year)) {
    return '';
  }
  return `${dob.day}/${dob.month}/${dob.year}`;
};

export const formatAddress = (c: AdditionalClaimant): string => {
  const parts = [
    c.address?.AddressLine1,
    c.address?.AddressLine2,
    c.address?.PostTown,
    c.address?.Country,
    c.address?.PostCode,
  ].filter(Boolean);
  return parts.join('<br>');
};

export const formatName = (c: AdditionalClaimant): string => {
  const parts = [c.title, c.firstName, c.lastName].filter(Boolean);
  return parts.join(' ');
};

export const clearAdditionalClaimantTransientFields = (req: AppRequest): void => {
  req.session.additionalClaimantNewFlow = false;
  req.session.userCase.currentAdditionalClaimantIndex = undefined;
  req.session.userCase.additionalClaimantTitle = undefined;
  req.session.userCase.additionalClaimantFirstName = undefined;
  req.session.userCase.additionalClaimantLastName = undefined;
  req.session.userCase.additionalClaimantEmail = undefined;
  req.session.userCase.additionalClaimantDob = { day: '', month: '', year: '' };
  req.session.userCase.additionalClaimantAddress1 = undefined;
  req.session.userCase.additionalClaimantAddress2 = undefined;
  req.session.userCase.additionalClaimantAddressTown = undefined;
  req.session.userCase.additionalClaimantAddressCountry = undefined;
  req.session.userCase.additionalClaimantAddressPostcode = undefined;
  req.session.userCase.additionalClaimantEnterPostcode = undefined;
  req.session.userCase.additionalClaimantAddressTypes = undefined;
  req.session.userCase.additionalClaimantAddresses = undefined;
};
