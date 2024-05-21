import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TseStatus } from '../../definitions/constants';

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
  } else if (app.value.respondStoredCollection) {
    for (const respond of app.value.respondStoredCollection) {
      app.redirectUrl =
        PageUrls.STORED_TO_SUBMIT_RESPONSE.replace(':appId', app.id).replace(':responseId', respond.id) +
        getLanguageParam(url);
    }
  }
};
