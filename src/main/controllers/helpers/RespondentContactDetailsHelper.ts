import { AppRequest } from '../../definitions/appRequest';
import { EmailOrPost, Et3ResponseStatus, Representative, Respondent, YesOrNo } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

/**
 * Check if respondent ET3 is received and accepted
 * @param respondent respondent
 */
export const isET3Accepted = (respondent: Respondent): boolean => {
  return respondent?.responseReceived === YesOrNo.YES && respondent.responseStatus === Et3ResponseStatus.ACCEPTED;
};

/**
 * Get respondent contact details rows
 * @param req request
 */
export const getRespondentContactDetails = (req: AppRequest): SummaryListRow[][] => {
  const userCase = req.session?.userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.RESPONDENT_CONTACT_DETAILS, { returnObjects: true }),
  };
  const list: SummaryListRow[][] = [];
  userCase.respondents
    ?.filter(r => isET3Accepted(r))
    .forEach(r => {
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
