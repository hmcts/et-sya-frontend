import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { getLogger } from '../logger';

import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('ContactTheTribunalFileController');

export default class ContactTheTribunalFileController {
  public get = (req: AppRequest, res: Response): void => {
    req.session.userCase.contactApplicationFile = undefined;
    const languageParam = getLanguageParam(req.url);

    const selectedOption = req.params.application;
    if (!applications.includes(selectedOption)) {
      logger.info('bad request parameter: "' + selectedOption + '"');
      res.redirect(ErrorPages.NOT_FOUND + languageParam);
      return;
    }

    const redirectUrl = PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', selectedOption) + languageParam;
    res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };
}
