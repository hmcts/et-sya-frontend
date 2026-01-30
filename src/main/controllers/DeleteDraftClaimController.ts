import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { getLogger } from '../logger';

import { deleteDraftCase } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('DeleteDraftClaimController');
export default class DeleteDraftClaimController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.DELETE_DRAFT_CLAIM, { returnObjects: true }),
    };
    const languageParam = getLanguageParam(req.url);
    res.render(TranslationKeys.DELETE_DRAFT_CLAIM, {
      ...req.t(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, { returnObjects: true }),
      ...content,
      caseReference: req.params.id,
      deleteButtonUrl: PageUrls.DELETE_DRAFT_CLAIM.replace(':id', req.params.id) + languageParam,
      backToCaseUrl: PageUrls.CLAIMANT_APPLICATIONS + languageParam,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      await deleteDraftCase(req, logger);
      // Redirect to claimant applications page after successful deletion
      const languageParam = getLanguageParam(req.url);
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS + languageParam);
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
