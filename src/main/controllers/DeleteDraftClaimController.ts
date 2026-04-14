import { Response } from 'express';

import { DeleteClaimCheck } from '../decorators/DeleteClaimCheck';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { deleteDraftCase } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('DeleteDraftClaimController');
export default class DeleteDraftClaimController {
  @DeleteClaimCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (req.query?.redirect === 'claimant-applications') {
      redirectUrl = PageUrls.CLAIMANT_APPLICATIONS;
    } else if (req.query?.redirect === 'claim-steps') {
      redirectUrl = PageUrls.CLAIM_STEPS;
    }

    const content = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.DELETE_DRAFT_CLAIM, { returnObjects: true }),
    };
    const languageParam = getLanguageParam(req.url);
    const paramId = req.params.id;
    const caseReference = paramId && paramId !== 'undefined' ? paramId : req.session.userCase?.id;
    res.render(TranslationKeys.DELETE_DRAFT_CLAIM, {
      ...req.t(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, { returnObjects: true }),
      ...content,
      caseReference,
      deleteButtonUrl: PageUrls.DELETE_DRAFT_CLAIM.replace(':id', caseReference) + languageParam,
      cancelLink: redirectUrl + languageParam,
    });
  };

  @DeleteClaimCheck()
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.id)).data
      );

      await deleteDraftCase(req, logger);
      // Redirect to claimant applications page after successful deletion
      const languageParam = getLanguageParam(req.url);

      req.session.deletedCaseIds = req.session.deletedCaseIds || [];
      req.session.deletedCaseIds.push(req.params.id);

      // Clear the user case from the session after deletion
      req.session.userCase = null;
      req.session.save(() => {
        return res.redirect(PageUrls.CLAIMANT_APPLICATIONS + languageParam);
      });
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
