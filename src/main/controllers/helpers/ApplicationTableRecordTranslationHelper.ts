import { ApplicationTableRecord, TypesOfClaim } from '../../definitions/definition';
import { AnyRecord } from '../../definitions/util-types';

export const translateTypesOfClaims = (rec: ApplicationTableRecord, translations: AnyRecord): void => {
  rec.userCase.typeOfClaim = rec?.userCase?.typeOfClaim?.map(toc => translateTypeOfClaim(toc, translations));
  rec.userCase.typeOfClaimString = rec?.userCase?.typeOfClaim?.toString()?.replace(/,/gm, ', ');
};

export const translateTypeOfClaim = (typeOfClaims: string, translations: AnyRecord): string => {
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
      return translations.claimTypes.otherTypesOfClaims;

    default:
      return undefined;
  }
};

export const translateOverallStatus = (status: AnyRecord, translations: AnyRecord): string => {
  return `${status.sectionCount} ${translations.of} ${status.totalSections} ${translations.tasksCompleted}`;
};

// TODO: 10/26/2022 Ivan Kirsanov: Probably instead of this function we need to use i18next.language(currently not working)
export const retrieveCurrentLocale = (url: string): string => {
  return url && url.includes('?lng=cy') ? 'cy' : 'en-GB';
};
