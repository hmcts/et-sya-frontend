import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink, getStoredToSubmitLink } from './helpers/Rule92NotSystemUserHelper';
import { getViewSupportingDoc } from './helpers/StoredApplicationConfirmationHelper';

export default class StoredApplicationConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink: getStoredToSubmitLink(userCase.id, languageParam), // TODO: replace it with app.id
      viewSupportingDoc: getViewSupportingDoc(userCase, translations),
    });
  }
}
