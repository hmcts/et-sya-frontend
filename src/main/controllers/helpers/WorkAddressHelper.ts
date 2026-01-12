import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Respondent } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';

import { getRespondentRedirectUrl } from './RespondentHelpers';

export const updateWorkAddress = (userCase: CaseWithId, respondent: Respondent): void => {
  userCase.workAddress1 = respondent.respondentAddress1;
  userCase.workAddress2 = respondent.respondentAddress2;
  userCase.workAddressTown = respondent.respondentAddressTown;
  userCase.workAddressCountry = respondent.respondentAddressCountry;
  userCase.workAddressPostcode = respondent.respondentAddressPostcode;
};

export const getRedirectUrl = (req: AppRequest, isRespondentAndWorkAddressSame: boolean, isCya: boolean): string => {
  const { saveForLater } = req.body;
  if (saveForLater) {
    return PageUrls.CLAIM_SAVED;
  }

  if (isCya && isRespondentAndWorkAddressSame) {
    return PageUrls.CHECK_ANSWERS;
  }

  return isRespondentAndWorkAddressSame
    ? getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.ACAS_CERT_NUM)
    : getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.WORK_POSTCODE_ENTER);
};
