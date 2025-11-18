import { Organisation } from './Organisation';

// In TypeScript, property names are typically written in camelCase.
// However, we're preserving the original casing to maintain consistency with the backend model.
export interface OrganisationPolicy {
  Organisation?: Organisation;
  OrgPolicyReference?: string;
  OrgPolicyCaseAssignedRole?: string;
  PrepopulateToUsersOrganisation?: string;
}
