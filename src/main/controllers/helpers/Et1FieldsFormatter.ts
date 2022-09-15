// Formatter for ET1 form values
import { CaseWithId } from '../../definitions/case';

export const getEt1DetailsFormatted = (userCase: CaseWithId): unknown => {
  return {
    dob: userCase.dobDate.day ? userCase.dobDate.day + '-' + userCase.dobDate.month + '-' + userCase.dobDate.year : '',
    sex: userCase.claimantSex,
    title: userCase.preferredTitle ? userCase.preferredTitle : 'Not Selected',
    address: userCase.address1
      ? [
          userCase.address1,
          userCase.address2,
          userCase.addressTown,
          userCase.addressCountry,
          userCase.addressPostcode,
        ].join(', ')
      : '',
    phone: userCase.telNumber.length === 0 ? 'Not Provided' : userCase.telNumber,
    contactPreference: userCase.claimantContactPreference,
    hearingPreference: userCase.hearingPreferences,
    reasonableAdjustments:
      userCase.reasonableAdjustments +
      (userCase.reasonableAdjustmentsDetail ? ', ' + userCase.reasonableAdjustmentsDetail : ''),
  };
};
