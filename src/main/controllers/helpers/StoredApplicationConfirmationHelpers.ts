import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';

export const getLatestApplication = async (
  items: GenericTseApplicationTypeItem[]
): Promise<GenericTseApplicationTypeItem> => {
  const filteredItem = items?.filter(it => it.value.applicant === Applicant.CLAIMANT);
  return filteredItem[filteredItem.length - 1];
};

export const getFullTseApplicationCollection = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return [].concat(userCase.genericTseApplicationCollection, userCase.tseApplicationStoredCollection);
};
