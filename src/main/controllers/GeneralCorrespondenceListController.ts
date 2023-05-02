import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { changeRedirectPageForGeneralCorrespondence } from './helpers/GeneralCorrespondenceHelper';

export class GeneralCorrespondenceListController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    let correspondences;
    if (userCase.sendNotificationCollection?.length > 0) {
      correspondences = userCase.sendNotificationCollection.filter(it =>
        it.value.sendNotificationSubject.includes('Other (General correspondence)')
      );
      changeRedirectPageForGeneralCorrespondence(correspondences, req.url);
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.GENERAL_CORRESPONDENCE_LIST, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.GENERAL_CORRESPONDENCE_LIST,
    ]);
    res.render(TranslationKeys.GENERAL_CORRESPONDENCE_LIST, {
      ...content,
      translations,
      correspondences,
    });
  };
}
