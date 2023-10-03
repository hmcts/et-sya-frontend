import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';

import { getAppDetailsLink, getTribunalOrderOrRequestDetailsLink } from './LinkHelpers';

export const setViewCorrespondenceLinkForApplication = (userCase: CaseWithId, languageParam: string): void => {
  userCase.viewCorrespondenceLink = undefined;
  userCase.viewCorrespondenceDoc = undefined;
  if (userCase.selectedRequestOrOrder) {
    userCase.viewCorrespondenceLink = getTribunalOrderOrRequestDetailsLink(
      userCase.selectedRequestOrOrder.id,
      languageParam
    );
  } else if (userCase.selectedGenericTseApplication) {
    userCase.viewCorrespondenceLink = getAppDetailsLink(userCase.selectedGenericTseApplication.id, languageParam);
  }
};

export const getLatestApplication = async (
  items: GenericTseApplicationTypeItem[]
): Promise<GenericTseApplicationTypeItem> => {
  const filteredItem = items?.filter(it => it.value.applicant === Applicant.CLAIMANT);
  return filteredItem[filteredItem.length - 1];
};
