import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class DeleteDraftClaimController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.DELETE_DRAFT_CLAIM, { returnObjects: true }),
    };
    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);
    res.render(TranslationKeys.DELETE_DRAFT_CLAIM, {
      ...req.t(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, { returnObjects: true }),
      ...content,
      caseReference: userCase.id,
      backToCaseUrl: PageUrls.CLAIMANT_APPLICATIONS + languageParam,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // TODO: Add logic to delete the draft claim from the database or API
    res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
  };
}
