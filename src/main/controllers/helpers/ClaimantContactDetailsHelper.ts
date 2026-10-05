import { CaseWithId } from '../../definitions/case';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

/**
 * Build the read-only contact detail rows for the represented claimant, shown on the rep hub.
 */
export const getClaimantContactDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  const fullName = [userCase?.representedClaimantFirstName, userCase?.representedClaimantLastName]
    .filter(Boolean)
    .join(' ');
  rows.push(addSummaryRow(translations.name, fullName || translations.notProvided));

  const dob = userCase?.representedClaimantDateOfBirth;
  const dobText =
    dob?.day && dob?.month && dob?.year ? `${dob.day}-${dob.month}-${dob.year}` : translations.notProvided;
  rows.push(addSummaryRow(translations.dateOfBirth, dobText));

  const address = answersAddressFormatter(
    userCase?.representedClaimantAddress1,
    userCase?.representedClaimantAddress2,
    userCase?.representedClaimantAddressTown,
    userCase?.representedClaimantAddressPostcode,
    userCase?.representedClaimantAddressCountry
  );
  rows.push(addSummaryRow(translations.address, address || translations.notProvided));

  rows.push(addSummaryRow(translations.email, userCase?.representedClaimantEmail || translations.notProvided));

  return rows;
};
