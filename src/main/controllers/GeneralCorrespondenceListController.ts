import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { NotificationSubjects, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { updateGeneralCorrespondenceRedirectLinksAndStatus } from './helpers/GeneralCorrespondenceHelper';

export class GeneralCorrespondenceListController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.GENERAL_CORRESPONDENCE_LIST, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.GENERAL_CORRESPONDENCE_LIST,
    ]);

    let correspondences;
    if (userCase.sendNotificationCollection?.length) {
      correspondences = userCase.sendNotificationCollection.filter(it =>
        it.value.sendNotificationSubject.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)
      );
      updateGeneralCorrespondenceRedirectLinksAndStatus(correspondences, req.url, translations);
    }

    res.render(TranslationKeys.GENERAL_CORRESPONDENCE_LIST, {
      ...content,
      translations,
      correspondences,
    });
  };
}
