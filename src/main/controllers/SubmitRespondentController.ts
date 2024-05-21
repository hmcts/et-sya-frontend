import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { clearTseFields, handleUpdateHubLinksStatuses, respondToApplication } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('SubmitRespondentController');

export default class SubmitRespondentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      await handleUpdateHubLinksStatuses(req, logger);
      await respondToApplication(req, logger);
      userCase.rule92state = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTseFields(req.session?.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    return res.redirect(PageUrls.RESPOND_TO_APPLICATION_COMPLETE + getLanguageParam(req.url));
  };
}
