import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, EmailOrPost, Representative, Respondent, YesOrNo } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

/**
 * check if Respondent Contact Details is ready to show
 * return true when any respondent is legally represented or ET3 received
 * @param userCase userCase
 */
export const shouldShowViewRespondentContactDetails = (userCase: CaseWithId): boolean => {
  if (!userCase?.respondents) {
    return false;
  }
  return userCase.respondents.some(respondent => {
    const hasRepresentative = userCase.representatives?.some(rep => rep.respondentId === respondent.ccdId);
    return hasRepresentative || respondent.responseReceived === YesOrNo.YES;
  });
};

/**
 * Get respondent contact details rows
 * @param req request
 */
export const getRespondentContactDetails = (req: AppRequest): SummaryListRow[][] => {
  const userCase = req.session?.userCase;
  if (!userCase?.respondents) {
    return [];
  }
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.RESPONDENT_CONTACT_DETAILS, { returnObjects: true }),
  };
  const list: SummaryListRow[][] = [];
  userCase.respondents.forEach(respondent => {
    const legalRep = userCase.representatives?.find(rep => rep.respondentId === respondent.ccdId);
    if (legalRep) {
      list.push(getRespondentLegalRepInfo(legalRep, translations));
    } else if (respondent.responseReceived === YesOrNo.YES) {
      list.push(getRespondentInfo(respondent, translations));
    }
  });
  return list;
};

const getRespondentLegalRepInfo = (rep: Representative, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];

  details.push(
    addSummaryRow(translations.legalRepresentativesName, rep.nameOfRepresentative || translations.notProvided)
  );

  details.push(addSummaryRow(translations.legalRepsOrganisation, rep.nameOfOrganisation || translations.notProvided));

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
    const preference = rep.representativePreference === EmailOrPost.EMAIL ? translations.email : translations.post;
    details.push(addSummaryRow(translations.preferredMethod, preference));
  }

  return details;
};

const getRespondentInfo = (respondent: Respondent, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];

  details.push(addSummaryRow(translations.name, respondent.respondentName));

  details.push(addSummaryRow(translations.employerName, respondent.responseRespondentName || translations.notProvided));

  const address = respondent.responseRespondentAddress;
  const addressString = answersAddressFormatter(
    address?.AddressLine1,
    address?.AddressLine2,
    address?.PostTown,
    address?.PostCode,
    address?.Country
  );
  details.push(addSummaryRow(translations.address, addressString));

  details.push(addSummaryRow(translations.email, respondent.responseRespondentEmail || translations.notProvided));

  if (respondent.responseRespondentContactPreference) {
    const preference =
      respondent.responseRespondentContactPreference === EmailOrPost.EMAIL ? translations.email : translations.post;
    details.push(addSummaryRow(translations.preferredMethod, preference));
  }

  return details;
};
