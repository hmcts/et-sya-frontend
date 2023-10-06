import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('StoredResponseAppConfirmationController');

export default class StoredResponseAppConfirmationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    if (req.params.appId === undefined) {
      logger.error('Application ID not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink: getAppDetailsLink(req.params.appId, languageParam),
    });
  }
}
