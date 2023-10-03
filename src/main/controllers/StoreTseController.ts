import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields } from './helpers/CaseHelpers';
import { getAppDetailsLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getLatestApplication } from './helpers/StoredApplicationConfirmationHelpers';

const logger = getLogger('StoreTseController');

export default class StoreTseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.STORED;
      await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      await getCaseApi(req.session.user?.accessToken).storeClaimantTse(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      clearTseFields(userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      const latestApplication = await getLatestApplication(userCase.genericTseApplicationCollection);
      req.session.userCase.viewCorrespondenceLink = getAppDetailsLink(latestApplication.id, languageParam);
      req.session.userCase.viewCorrespondenceDoc = latestApplication.value.documentUpload;
    } catch (err) {
      logger.error(err.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.STORED_APPLICATION_CONFIRMATION + languageParam);
  };
}
