import { CaseWithId, YesOrNo } from '../../definitions/case';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

export class ContactTheTribunalHelper {
  /**
   * Determines whether the claimant is legally represented by an organisation.
   *
   * This method checks if:
   * - The `claimantRepresentedQuestion` field exists and is set to `YesOrNo.YES`.
   * - And either:
   *   - The claimant's representative organisation policy contains a non-empty `Organisation`
   *     object with a valid `OrganisationID`, **or**
   *   - The claimant representative object includes a non-empty `myHmctsOrganisation`.
   *
   * @param {CaseWithId} userCase - The case data object containing claimant and representative details.
   * @returns {boolean} `true` if the claimant is represented by an organisation, otherwise `false`.
   */
  public static isClaimantRepresentedByOrganisation(userCase: CaseWithId): boolean {
    return (
      userCase.claimantRepresentedQuestion !== undefined &&
      userCase.claimantRepresentedQuestion === YesOrNo.YES &&
      ((ObjectUtils.isNotEmpty(userCase?.claimantRepresentativeOrganisationPolicy?.Organisation) &&
        StringUtils.isNotBlank(userCase.claimantRepresentativeOrganisationPolicy.Organisation.OrganisationID)) ||
        (ObjectUtils.isNotEmpty(userCase.claimantRepresentative) &&
          ObjectUtils.isNotEmpty(userCase.claimantRepresentative.myHmctsOrganisation)))
    );
  }
}
