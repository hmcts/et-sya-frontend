import { translateTypesOfClaimHelper } from '../../../../main/controllers/helpers/TranslateTypesOfClaimHelper';
import { mockApplicationWithAllTypeOfClaims } from '../../mocks/mockApplicationWithAllTypeOfClaims';
import { mockTranslations } from '../../mocks/mockTranslations';

describe('translateTypesOfClaimHelper', () => {
  it('should translate typesOfClaims to Welsh', () => {
    translateTypesOfClaimHelper(mockApplicationWithAllTypeOfClaims, mockTranslations);
    const translatedTypesOfClaims = mockApplicationWithAllTypeOfClaims[0].userCase.typeOfClaim;
    expect(translatedTypesOfClaims).toContain('Torri contract');
    expect(translatedTypesOfClaims).toContain('Gwahaniaethu');
    expect(translatedTypesOfClaims).toContain('Ymwneud â thâl');
    expect(translatedTypesOfClaims).toContain('Diswyddo annheg');
    expect(translatedTypesOfClaims).toContain('Chwythu’r chwiban');
    expect(translatedTypesOfClaims).toContain('Math arall o hawliad');
  });
});
