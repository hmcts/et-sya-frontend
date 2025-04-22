import { AppRequest } from '../../definitions/appRequest';
import { Representative, Respondent } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

export const getRespondentContactDetails = (req: AppRequest): SummaryListRow[][] => {
  const userCase = req.session?.userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.RESPONDENT_CONTACT_DETAILS, { returnObjects: true }),
  };
  const list: SummaryListRow[][] = [];
  userCase.respondents?.forEach(r => {
    const assignedRep = userCase.representatives?.find(rep => rep.respondentId === r.ccdId);
    if (assignedRep) {
      list.push(getRespondentLegalRepInfo(assignedRep, translations));
    } else {
      list.push(getRespondentInfo(r, translations));
    }
  });
  return list;
};

const getRespondentLegalRepInfo = (rep: Representative, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];

  details.push(addSummaryRow(translations.legalRepresentativesName, rep.nameOfRepresentative || ''));

  details.push(addSummaryRow(translations.legalRepsOrganisation, rep.nameOfOrganisation || ''));

  const address = rep.representativeAddress;
  const addressString = answersAddressFormatter(
    address?.AddressLine1,
    address?.AddressLine2,
    address?.PostTown,
    address?.PostCode,
    address?.Country
  );
  details.push(addSummaryRow(translations.address, addressString));

  details.push(addSummaryRow(translations.email, rep.representativeEmailAddress));

  if (rep.representativePreference) {
    details.push(addSummaryRow(translations.preferredMethod, rep.representativePreference));
  }

  return details;
};

const getRespondentInfo = (respondent: Respondent, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];

  details.push(addSummaryRow(translations.name, respondent.responseRespondentName));

  details.push(addSummaryRow(translations.organisationName, respondent.respondentOrganisation || ''));

  const address = respondent.responseRespondentAddress;
  const addressString = answersAddressFormatter(
    address?.AddressLine1,
    address?.AddressLine2,
    address?.PostTown,
    address?.PostCode,
    address?.Country
  );
  details.push(addSummaryRow(translations.address, addressString));

  details.push(addSummaryRow(translations.email, respondent.responseRespondentEmail));

  if (respondent.responseRespondentContactPreference) {
    details.push(addSummaryRow(translations.preferredMethod, respondent.responseRespondentContactPreference));
  }

  return details;
};
