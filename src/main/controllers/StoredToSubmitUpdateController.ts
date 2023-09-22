import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { storedToSubmitClaimantTse } from './helpers/StoreTseCaseHelpers';

const logger = getLogger('StoredToSubmitUpdateController');

export default class StoredToSubmitUpdateController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
    } catch (error) {
      logger.info(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      await storedToSubmitClaimantTse(req, logger);
      userCase.selectedGenericTseApplication = undefined;
      userCase.confirmCopied = undefined;
    } catch (error) {
      logger.info(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
