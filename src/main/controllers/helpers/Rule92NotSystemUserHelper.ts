import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, TseStatusStored } from '../../definitions/constants';

import { getStoredToSubmitLink } from './LinkHelpers';

export const getStoredPendingApplicationLinks = (
  apps: GenericTseApplicationTypeItem[],
  languageParam: string
): string[] => {
  return apps
    ?.filter(app => app.value.status === TseStatusStored)
    .map(app => getStoredToSubmitLink(app.id, languageParam));
};

export const getLatestApplication = async (
  items: GenericTseApplicationTypeItem[]
): Promise<GenericTseApplicationTypeItem> => {
  const filteredItem = items?.filter(it => it.value.applicant === Applicant.CLAIMANT);
  return filteredItem[filteredItem.length - 1];
};
