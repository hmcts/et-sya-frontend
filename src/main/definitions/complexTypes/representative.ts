import { YesOrNo } from '../case';

import { Et1Address } from './et1Address';

export interface RepresentativeType {
  respondentId?: string;
  name_of_representative?: string;
  name_of_organisation?: string;
  representative_address?: Et1Address;
  representative_email_address?: string;
  representative_preference?: string;
  myHmctsYesNo?: YesOrNo;
}
