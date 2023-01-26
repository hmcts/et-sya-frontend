import {
  retrieveCurrentLocale,
  translateOverallStatus,
  translateTypesOfClaims,
} from '../../../../main/controllers/helpers/ApplicationTableRecordTranslationHelper';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { mockApplicationWithAllTypeOfClaims } from '../../mocks/mockApplicationWithAllTypeOfClaims';
import { mockWelshClaimTypesTranslations } from '../../mocks/mockTranslations';

describe('translateTypesOfClaimHelper', () => {
  it('should translate typesOfClaims to Welsh', () => {
    translateTypesOfClaims(mockApplicationWithAllTypeOfClaims, mockWelshClaimTypesTranslations);
    const translatedTypesOfClaims = mockApplicationWithAllTypeOfClaims.userCase.typeOfClaim;
    expect(translatedTypesOfClaims).toContain('Torri contract');
    expect(translatedTypesOfClaims).toContain(' Gwahaniaethu');
    expect(translatedTypesOfClaims).toContain(' Ymwneud â thâl');
    expect(translatedTypesOfClaims).toContain(' Diswyddo annheg');
    expect(translatedTypesOfClaims).toContain(' Chwythu’r chwiban');
    expect(translatedTypesOfClaims).toContain(' Math arall o hawliad');
  });
});

describe('translateOverallStatus', () => {
  it('should translate status message to Welsh', () => {
    const overallStatus: AnyRecord = {
      sectionCount: 1,
      totalSections: 4,
    };
    const translatedStatus = translateOverallStatus(overallStatus, mockWelshClaimTypesTranslations);
    expect(translatedStatus).toEqual("1 o 4 tasg wedi'u cwblhau");
  });
});

describe('retrievePageLanguage', () => {
  it('should retrieve from current url en-GB locale', () => {
    const url = 'www.englishTestPage.com';
    expect(retrieveCurrentLocale(url)).toEqual('en-GB');
  });

  it('should retrieve from current url cy locale', () => {
    const url = 'www.englishTestPage?lng=cy.com';
    expect(retrieveCurrentLocale(url)).toEqual('cy');
  });
});
