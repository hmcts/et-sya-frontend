import { CaseWithId, YesOrNo } from '../../definitions/case';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

export class ContactTheTribunalHelper {
  public static isClaimantRepresentedByOrganisation(userCase: CaseWithId): boolean {
    return (
      userCase.claimantRepresentedQuestion !== undefined &&
      userCase.claimantRepresentedQuestion === YesOrNo.YES &&
      ObjectUtils.isNotEmpty(userCase?.claimantRepresentativeOrganisationPolicy?.Organisation) &&
      StringUtils.isNotBlank(userCase.claimantRepresentativeOrganisationPolicy.Organisation.OrganisationID)
    );
  }
}
