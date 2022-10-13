import { ApplicationTableRecord, TypesOfClaim } from '../../definitions/definition';
import { AnyRecord } from '../../definitions/util-types';

export const translateTypesOfClaim = (records: ApplicationTableRecord[], translations: AnyRecord): void => {
  records.map(record => {
    record.userCase.typeOfClaim = record?.userCase?.typeOfClaim?.map(toc => retrieveTypeOfClaim(toc, translations));
    return record;
  });
};

export const retrieveTypeOfClaim = (typeOfClaims: string, translations: AnyRecord): string => {
  switch (typeOfClaims) {
    case TypesOfClaim.UNFAIR_DISMISSAL.toString():
      return translations.claimTypes.unfairDismissal;
    case TypesOfClaim.PAY_RELATED_CLAIM.toString():
      return translations.claimTypes.payRelated;
    case TypesOfClaim.DISCRIMINATION.toString():
      return translations.claimTypes.discrimination;
    case TypesOfClaim.WHISTLE_BLOWING.toString():
      return translations.claimTypes.whistleBlowing;
    case TypesOfClaim.BREACH_OF_CONTRACT.toString():
      return translations.claimTypes.breachOfContract;
    case TypesOfClaim.OTHER_TYPES.toString():
      return translations.claimTypes.otherClaim;
    default:
      return undefined;
  }
};
