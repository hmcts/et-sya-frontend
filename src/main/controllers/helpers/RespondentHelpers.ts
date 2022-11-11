import { cloneDeep } from 'lodash';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Respondent, YesOrNo } from '../../definitions/case';
import { ErrorPages } from '../../definitions/constants';

export const setUserCaseForRespondent = (req: AppRequest, form: Form): void => {
  const formData = form.getParsedBody(cloneDeep(req.body), form.getFormFields());
  const selectedRespondentIndex = getRespondentIndex(req);
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  let respondent: Respondent;
  if (req.session.userCase.respondents === undefined) {
    req.session.userCase.respondents = [];
    respondent = {
      respondentNumber: 1,
    };
    req.session.userCase.respondents.push(respondent);
  } else if (req.session.userCase.respondents.length <= selectedRespondentIndex) {
    respondent = {
      respondentNumber: selectedRespondentIndex + 1,
    };
    req.session.userCase.respondents.push(respondent);
  }
  if (formData.acasCert !== undefined && formData.acasCert === YesOrNo.NO) {
    formData.acasCertNum = undefined;
  }
  if (formData.acasCert === YesOrNo.YES) {
    formData.noAcasReason = undefined;
  }
  Object.assign(req.session.userCase.respondents[selectedRespondentIndex], formData);
};

export const getRespondentIndex = (req: AppRequest): number => {
  return parseInt(req.params.respondentNumber) - 1;
};

export const getRespondentRedirectUrl = (respondentNumber: string | number, pageUrl: string): string => {
  if (respondentNumber < 6) {
    return '/respondent/' + respondentNumber.toString() + pageUrl;
  }
  return ErrorPages.NOT_FOUND;
};

export const mapSelectedRespondentValuesToCase = (selectedRespondentIndex: number, userCase: CaseWithId): void => {
  if (typeof selectedRespondentIndex !== 'undefined' && userCase.respondents !== undefined) {
    userCase.respondentName = userCase.respondents[selectedRespondentIndex]?.respondentName;
    userCase.respondentAddress1 = userCase.respondents[selectedRespondentIndex]?.respondentAddress1;
    userCase.respondentAddress2 = userCase.respondents[selectedRespondentIndex]?.respondentAddress2;
    userCase.respondentAddressTown = userCase.respondents[selectedRespondentIndex]?.respondentAddressTown;
    userCase.respondentAddressCountry = userCase.respondents[selectedRespondentIndex]?.respondentAddressCountry;
    userCase.respondentAddressPostcode = userCase.respondents[selectedRespondentIndex]?.respondentAddressPostcode;
    userCase.acasCert = userCase.respondents[selectedRespondentIndex]?.acasCert;
    userCase.acasCertNum = userCase.respondents[selectedRespondentIndex]?.acasCertNum;
    userCase.noAcasReason = userCase.respondents[selectedRespondentIndex]?.noAcasReason;
  }
};

export const updateWorkAddress = (userCase: CaseWithId, respondent: Respondent): void => {
  userCase.workAddress1 = respondent.respondentAddress1;
  userCase.workAddress2 = respondent.respondentAddress2;
  userCase.workAddressTown = respondent.respondentAddressTown;
  userCase.workAddressCountry = respondent.respondentAddressCountry;
  userCase.workAddressPostcode = respondent.respondentAddressPostcode;
};
