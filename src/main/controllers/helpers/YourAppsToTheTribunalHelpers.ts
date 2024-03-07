import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, ResponseStatus, TseStatus } from '../../definitions/constants';

import { getLanguageParam } from './RouterHelpers';

export const updateStoredRedirectUrl = (appList: GenericTseApplicationTypeItem[], url: string): void => {
  if (appList) {
    for (const app of appList) {
      checkAndUpdateGenericTseApplication(app, url);
    }
  }
};

const checkAndUpdateGenericTseApplication = (app: GenericTseApplicationTypeItem, url: string): void => {
  if (app.value.status === TseStatus.STORED_STATE) {
    app.redirectUrl = PageUrls.STORED_TO_SUBMIT.replace(':appId', app.id) + getLanguageParam(url);
  } else if (app.value.respondCollection) {
    for (const respond of app.value.respondCollection) {
      checkAndUpdateRespondCollection(respond, app, url);
    }
  }
};

const checkAndUpdateRespondCollection = (
  respond: TseRespondTypeItem,
  app: GenericTseApplicationTypeItem,
  url: string
): void => {
  if (respond.value.from === Applicant.CLAIMANT && respond.value.status === ResponseStatus.STORED) {
    app.redirectUrl =
      PageUrls.STORED_TO_SUBMIT_RESPONSE.replace(':appId', app.id).replace(':responseId', respond.id) +
      getLanguageParam(url);
  }
};
